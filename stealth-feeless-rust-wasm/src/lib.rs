extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

use argon2::{self, Config, Variant};
use bytebuffer::ByteBuffer;
use byteorder::{BigEndian, ByteOrder};
use xorshift::{Rand, Rng, SeedableRng, SplitMix64, Xorshift1024};
use chrono::Utc;
use hex::{encode, decode};


// Pseudo Code

// Q2: HEIGHT = Get current chain height (e.g. getbestblock RPC), big endian 32 bit unsigned int

// Q3: Determine COST using SIZE (in bytes) of best block to estimate
// M = 1000 * (110)
// BASE = 256
// COST = (1 + SIZE/1000) * BASE
// i = 2
// while i <= (31 * SIZE) / 204800:
//   COST = (COST * M) / 100000
//   i = i+1
// # max possible hardness is 4608 desktop, 1024 mobile (suggested)
// MCOST = min(COST, 1024)

// Q4: Determine HASH of best block, decoded (i.e. bytes, not hex string)

// Q5: Get decoded unsigned (signatures blanked) serialized transaction TXBYTES (i.e., not hex)

// Q6: Feework data is catenated: DATA = HASH + TXBYTES

// Q7: Create starting SALT = XORShift1024*.next()
// The object XORShift1024* is a PRNG (https://arxiv.org/abs/1810.05313) available in 
// many programming languages. It's next() function returns a new pseudo-random number 
// every time it is called. Initialize with time as a seed. There is no need to worry 
// about cryptographic security for these random numbers.

// Q8: Calculate feework 8 byte OUTPUT using Argon2d (https://github.com/P-H-C/phc-winner-argon2) 
// OUTPUT = Argon2d(MCOST, DATA, SALT, TCOST=1, PARALLELISM=1)
// Calculate feework 8 byte OUTPUT using
// if OUTPUT > 0x0006ffffffffffff:
//     goto step 6

// The OUTPUT is discarded, but the final SALT is kept for the FEEWORK. Catenate:

// FEEWORK = HEIGHT + MCOST + SALT + OP_FEEWORK

// HEIGHT is 32 bit unsigned int, big endian
// MCOST is 32 bit unsigned int, big endian
// SALT is 8 bytes (created by PRNG as 64 bit unsigned int, big endian)
// OP_FEEWORK is 0xd1 (209) as 32 bit int, big endian

// FEEWORK is the scriptPubKey for an output with 0 value. Append this 0 value output 
// to the raw transaction and sign the whole transaction. Feework transactions 
// MUST be version 4, so the hash of the unsigned transaction needs to be prepended 
// to calculate the sighash, which is signed as part of the input signature. This is 
// not done in any standard library, so a custom signature routine needs to be created 
// for this part.

#[wasm_bindgen]
pub fn create_feework_and_script_pubkey(tx_unsigned_hex: String, block_height: u32, block_size: u32, block_hash: String) -> String {
    // MCOST
    let mcost = get_mcost_from_size(block_size);

    // DATA
    let data = get_data_from_tx_and_block_hash(tx_unsigned_hex, block_hash);

    // WORK
    let mut now = Utc::now().timestamp_millis() as u64;
    let mut sm: SplitMix64 = SeedableRng::from_seed(now);
    let mut rng: Xorshift1024 = Rand::rand(&mut sm);
    let mut work = rng.next_u64().to_be_bytes().to_vec();

    let config = get_argon2_config(mcost);

    let mut hash_denary = create_work(&data, &work, &config);
    let limit_denary = get_limit_denary();
    
    while hash_denary > limit_denary {
        now = Utc::now().timestamp_millis() as u64;
        sm = SeedableRng::from_seed(now);
        rng = Rand::rand(&mut sm);
        work = rng.next_u64().to_be_bytes().to_vec();
        hash_denary = create_work(&data, &work, &config);
    }

    // script pubkey
    get_script_pubkey(block_height, mcost, &work)
}

#[wasm_bindgen]
pub fn test_create_feework_and_script_pubkey(
    tx_unsigned_hex: String, 
    _block_height: u32, 
    block_size: u32, 
    block_hash: String, 
    script_pubkey_hex: String
) -> String {
    let script_pubkey_decoded = match decode(&script_pubkey_hex){
        Ok(val) => val,
        Err(_err) => vec![0_u8]
    };
    println!("testing the script pubkey hex {}", &script_pubkey_hex);
    // assert_eq!(script_pubkey_decoded.len(), 18);
    // assert_eq!(script_pubkey_decoded[0], 16);
    // assert_eq!(script_pubkey_decoded[17], 209);

    // check the salt
    let mcost = get_mcost_from_size(block_size);
    let data = get_data_from_tx_and_block_hash(tx_unsigned_hex, block_hash);
    let limit_denary = get_limit_denary();
    let work = vec![
        script_pubkey_decoded[9],
        script_pubkey_decoded[10],
        script_pubkey_decoded[11],
        script_pubkey_decoded[12],
        script_pubkey_decoded[13],
        script_pubkey_decoded[14],
        script_pubkey_decoded[15],
        script_pubkey_decoded[16]
    ];
    let config = get_argon2_config(mcost);
    let hash_denary = create_work(&data, &work, &config);
    let mut condition_text = "GREATER THAN";
    if !(hash_denary > limit_denary) {
        condition_text = "LESS THAN";
    }
    
    format!("ScriptPubkey length is {}, 1st element is {}, 18th element is {}. \
    Output is {}, which is {} of output condition {}.", 
        script_pubkey_decoded.len(),
        script_pubkey_decoded[0],
        script_pubkey_decoded[17],
        hash_denary,
        condition_text,
        limit_denary,
    )
}

fn get_mcost_from_size(block_size: u32) -> u32 {
    let m = 1000 * 110;
    let base = 256;
    let mut cost: f32 = (1.0 + block_size as f32 / 1000 as f32) * base as f32;
    let mut i = 2;
    while i <= (31 * block_size) / 204800 {
        cost = (cost * m as f32) / 100000 as f32;
        i = i + 1;
    }
    cost.round() as u32
}

fn get_data_from_tx_and_block_hash(tx_unsigned_hex: String, block_hash: String) -> Vec<u8> {
    (format!("{}{}", block_hash, tx_unsigned_hex)).as_bytes().to_vec()
}

fn get_limit_denary() -> u64 {
    BigEndian::read_u64(&0x0006ffffffffffff_u64.to_be_bytes())
}

fn get_argon2_config(mcost: u32) -> Config<'static> {
    let mut config = Config::default();
    config.variant = Variant::Argon2d;
    config.lanes = 1;
    config.time_cost = 1;
    config.mem_cost = mcost;
    config.hash_length = 8;
    config
}

fn create_work(data: &Vec<u8>, work: &Vec<u8>, config: &Config) -> u64{
    let hash = match argon2::hash_raw(&data, &work, &config) {
        Ok(hash) => hash,
        Err(err) =>  err.to_string().as_bytes().to_vec()
    };
    BigEndian::read_u64(&hash)
}


fn get_script_pubkey(height: u32, mcost: u32, work: &[u8]) -> String {
    let op_feework = 209; // 0xd1 or 209
    let height_offset = 1;
    let mcost_offset = 5;
    let work_offset = 9;
    let opcode_offset = 17;

    let mut buffer = ByteBuffer::new();
    buffer.set_wpos(0);
    buffer.write_u8(16);
    buffer.set_wpos(height_offset);
    buffer.write_u32(height);
    buffer.set_wpos(mcost_offset);
    buffer.write_u32(mcost);
    buffer.set_wpos(work_offset);
    buffer.write_bytes(&work);
    buffer.set_wpos(opcode_offset);
    buffer.write_u8(op_feework);

    encode(buffer.to_bytes())
}

#[cfg(test)]
mod tests {
    use super::*;
    use hex::decode;

    #[test]
    fn test_create_feework_and_script_pubkey() {
        let tx_unsigned_hex = "0400000002210ecf588314e42044779cdd3ae4d261de6f74da964e3ff371e4aeb3dc6ef6a40000000000ffffffffd47cac8d822b969c65901407614c5abd089b46df6091f9c6bd2e01409c418f290000000000ffffffff02f0490200000000001976a91497ffe061435ece8dcf7431d226583711c1c5611c88acf09c0900000000001976a914631bcbe2e0de22e1b7f5e7464ba1667432c796e288ac00000000".to_string();
        let _block_height = 4995442_u32;
        let block_size = 161_u32;
        let block_hash = "85041572fdd397dc78a0a444300c6d978a41ad64841530675c54090eb330b4f6".to_string();
        let script_pubkey_hex = "10004c3972000001003fd0b1cd71d6a0ead1".to_string();

        let script_pubkey_decoded = match decode(&script_pubkey_hex){
            Ok(val) => val,
            Err(_err) => vec![0_u8]
        };
        println!("testing the script pubkey hex {}", &script_pubkey_hex);
        assert_eq!(script_pubkey_decoded.len(), 18);
        assert_eq!(script_pubkey_decoded[0], 16);
        assert_eq!(script_pubkey_decoded[17], 209);

        // check the work
        let mcost = get_mcost_from_size(block_size);
        let data = get_data_from_tx_and_block_hash(tx_unsigned_hex, block_hash);
        let limit_denary = get_limit_denary();
        let work = vec![
            script_pubkey_decoded[9],
            script_pubkey_decoded[10],
            script_pubkey_decoded[11],
            script_pubkey_decoded[12],
            script_pubkey_decoded[13],
            script_pubkey_decoded[14],
            script_pubkey_decoded[15],
            script_pubkey_decoded[16]
        ];
        let config = get_argon2_config(mcost);
        let hash_denary = create_work(&data, &work, &config);
        let work_denary = BigEndian::read_u64(&work);
        println!("hash denary is {}, limit denary is {}, work denary is {}", &hash_denary, &limit_denary, &work_denary);
        assert_eq!(hash_denary > limit_denary, false);
    }

    
}