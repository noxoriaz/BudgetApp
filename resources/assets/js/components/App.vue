
<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info">

      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="/">Marppa Larppa Budget</b-navbar-brand>

    </b-navbar>
    <div class="container mt-3">
        <div>
            <transition name="fade">
                <router-view></router-view>
            </transition>
        </div>
    </div>
  </div>
</template>

<style>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
    }
</style>

<script>
    export default {}
</script>