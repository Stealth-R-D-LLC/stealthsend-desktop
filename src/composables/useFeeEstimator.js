export default function useTransactionBuilder(inputs = 0, outputs = 2) {
  const P2PKH_IN_SIZE = 148;

  const P2PKH_OUT_SIZE = 34;
  const P2SH_OUT_SIZE = 32;
  const P2SH_P2WPKH_OUT_SIZE = 32;
  const P2SH_P2WSH_OUT_SIZE = 32;
  const P2WPKH_OUT_SIZE = 31;
  const P2WSH_OUT_SIZE = 43;
  const P2TR_OUT_SIZE = 43;

  const input_count = inputs;
  const input_script = 'P2PKH';
  const inputWitnessSize = 0;
  // const input_n = 1// pubkey count
  const p2pkh_output_count = outputs;
  const p2sh_output_count = 0;
  const p2sh_p2wpkh_output_count = 0;
  const p2sh_p2wsh_output_count = 0;
  const p2wpkh_output_count = 0;
  const p2wsh_output_count = 0;
  const p2tr_output_count = 0;

  const output_count =
    p2pkh_output_count +
    p2sh_output_count +
    p2sh_p2wpkh_output_count +
    p2sh_p2wsh_output_count +
    p2wpkh_output_count +
    p2wsh_output_count +
    p2tr_output_count;

  // In most cases the input size is predictable. For multisig inputs we need to perform a detailed calculation
  var inputSize = 0; // in virtual bytes
  switch (input_script) {
    case 'P2PKH':
      inputSize = P2PKH_IN_SIZE;
      break;
  }
  var txVBytes =
    getTxOverheadVBytes(input_script, input_count, output_count) +
    inputSize * input_count +
    P2PKH_OUT_SIZE * p2pkh_output_count +
    P2SH_OUT_SIZE * p2sh_output_count +
    P2SH_P2WPKH_OUT_SIZE * p2sh_p2wpkh_output_count +
    P2SH_P2WSH_OUT_SIZE * p2sh_p2wsh_output_count +
    P2WPKH_OUT_SIZE * p2wpkh_output_count +
    P2WSH_OUT_SIZE * p2wsh_output_count +
    P2TR_OUT_SIZE * p2tr_output_count;

  // size in raw bytes
  var txBytes =
    getTxOverheadExtraRawBytes(input_script, input_count) +
    txVBytes +
    inputWitnessSize * input_count;

  const estimatedFee = estimateFee(txBytes);

  function getSizeOfVarInt(length) {
    if (length < 253) {
      return 1;
    } else if (length < 65535) {
      return 3;
    } else if (length < 4294967295) {
      return 5;
    } else if (length < 18446744073709551615) {
      return 9;
    } else {
      console.error('Invalid var int');
    }
  }

  function getTxOverheadVBytes(input_script, input_count, output_count) {
    var witness_vbytes = 0;
    if (input_script == 'P2PKH' || input_script == 'P2SH') {
      witness_vbytes = 0;
    } else {
      // Transactions with segwit inputs have extra overhead
      witness_vbytes =
        0.25 + // segwit marker
        0.25 + // segwit flag
        getSizeOfVarInt(input_count) / 4; // witness element count
    }

    return (
      4 + // nVersion
      getSizeOfVarInt(input_count) + // number of inputs
      getSizeOfVarInt(output_count) + // number of outputs
      4 + // nLockTime
      witness_vbytes
    );
  }

  function getTxOverheadExtraRawBytes(input_script, input_count) {
    var witness_vbytes = 0;
    if (input_script == 'P2PKH' || input_script == 'P2SH') {
      witness_vbytes = 0;
    } else {
      // Transactions with segwit inputs have extra overhead
      witness_vbytes =
        0.25 + // segwit marker
        0.25 + // segwit flag
        getSizeOfVarInt(input_count) / 4; // witness element count
    }

    return witness_vbytes * 3;
  }

  function estimateFee(bytes = 1000) {
    return Math.ceil(bytes / 1000) / 100;
  }

  console.log('ESTIMATED FEE: ', estimatedFee);
  return {
    fee: estimatedFee,
  };
}
