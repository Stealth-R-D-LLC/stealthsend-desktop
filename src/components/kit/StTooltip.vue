<template>
  <span :tooltip="tooltipText" :position="position"><slot /></span>
</template>

<script>
export default {
  name: 'StTooltip',
  props: {
    tooltipText: {
      type: String,
      default: 'Tooltip text'
    },
    position: {
      default: 'top',
      type: String
    }
  }
}
</script>

<style scoped>
[tooltip] {
  position: relative;
  transition: visibility 2s;
  /* position: TOP */
  /* position: BOTTOM */
  /* position: LEFT */
  /* position: RIGHT */
  /* FX All The Things */
}
[tooltip] > * {
  display: inline-block;
}
[tooltip]:before,
[tooltip]:after {
  text-transform: none;
  font-size: 14px;
  line-height: 1;
  user-select: none;
  pointer-events: none;
  position: absolute;
  visibility: hidden;
  opacity: 0;
}
[tooltip]:before {
  content: '';
  border: 5px solid transparent;
  z-index: var(--zTooltip);
}
[tooltip]:after {
  content: attr(tooltip);
  /* magic! */
  /* most of the rest of this is opinion */
  text-align: center;
  /* Let the content set the size of the tooltips but this will also keep them from being obnoxious */
  min-width: 3em;
  max-width: 21em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0.5rem;
  border-radius: 0.3rem;
  box-shadow: 0 1em 2em -0.5em rgba(0, 0, 0, 0.35);
  background: var(--grey1000);
  color: #fff;
  z-index: var(--zTooltip);
}
[tooltip]:hover:before,
[tooltip]:hover:after {
  visibility: visible;
}
[tooltip]:not([position]):before,
[tooltip][position^='top']:before {
  bottom: 100%;
  border-bottom-width: 0;
  border-top-color: var(--grey1000);
}
[tooltip]:not([position]):after,
[tooltip][position^='top']::after {
  bottom: calc(100% + 5px);
}
[tooltip]:not([position])::before,
[tooltip]:not([position])::after,
[tooltip][position^='top']::before,
[tooltip][position^='top']::after {
  left: 50%;
  transform: translate(-50%, -0.5em);
}
[tooltip][position^='bottom']::before {
  top: 105%;
  border-top-width: 0;
  border-bottom-color: var(--grey1000);
}
[tooltip][position^='bottom']::after {
  top: calc(105% + 5px);
}
[tooltip][position^='bottom']::before,
[tooltip][position^='bottom']::after {
  left: 50%;
  transform: translate(-50%, 0.5em);
}
[tooltip][position^='left']::before {
  top: 50%;
  border-right-width: 0;
  border-left-color: var(--grey1000);
  left: calc(0em - 5px);
  transform: translate(-0.5em, -50%);
}
[tooltip][position^='left']::after {
  top: 50%;
  right: calc(100% + 5px);
  transform: translate(-0.5em, -50%);
}
[tooltip][position^='right']::before {
  top: 50%;
  border-left-width: 0;
  border-right-color: var(--grey1000);
  right: calc(0em - 5px);
  transform: translate(0.5em, -50%);
}
[tooltip][position^='right']::after {
  top: 50%;
  left: calc(100% + 5px);
  transform: translate(0.5em, -50%);
}
[tooltip]:not([position]):hover::before,
[tooltip]:not([position]):hover::after,
[tooltip][position^='top']:hover::before,
[tooltip][position^='top']:hover::after,
[tooltip][position^='bottom']:hover::before,
[tooltip][position^='bottom']:hover::after {
  animation: tooltips-vert 300ms ease-out forwards;
}
[tooltip][position^='left']:hover::before,
[tooltip][position^='left']:hover::after,
[tooltip][position^='right']:hover::before,
[tooltip][position^='right']:hover::after {
  animation: tooltips-horz 300ms ease-out forwards;
}
/* don't show empty tooltips */
[tooltip='']::before,
[tooltip='']::after {
  visibility: hidden !important;
}
/* KEYFRAMES */
@keyframes tooltips-vert {
  to {
    opacity: 0.9;
    transform: translate(-50%, 0);
  }
}
@keyframes tooltips-horz {
  to {
    opacity: 0.9;
    transform: translate(0, -50%);
  }
}
</style>
