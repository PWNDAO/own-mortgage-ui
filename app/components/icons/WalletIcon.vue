<template>
    <svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <title>Your Wallet</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.5 12V8H8.91421L8.5 8.41421V11.5858L8.91421 12H18.5ZM8.5 13H19.5V7H8.5L7.5 8V12L8.5 13Z"
        :fill="props.color"/>
      <path
        d="M10.5 9L11.5 10L10.5 11L9.5 10L10.5 9Z"
        :fill="props.color"/>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17.0858 4L17.5 4.41421V8H18.5V4L17.5 3H2.5L1.5 4V16L2.5 17H17.5L18.5 16V12H17.5V15.5858L17.0858 16H2.91421L2.5 15.5858V4.41421L2.91421 4H17.0858Z"
        :fill="props.color"/>
    </svg>
  </template>
  
  <script setup lang="ts">
  interface Props {
    color?: string
  }
  
  const props = withDefaults(defineProps<Props>(), {
    color: 'var(--gray-2)',
  })
  </script>
  