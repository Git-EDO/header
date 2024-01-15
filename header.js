export default {
  data() {
    return {
      desktopResolution: 1200,
      desktopMenuTl: null,
      onTheFirstScreen: null,
      firstScreenScrollTarget: null,
      scrolling: {
        enabled: true,
        events: ['scroll', 'wheel', 'touchmove', 'pointermove'],
        prevent: (e) => e.preventDefault()
      },
      y: null
    }
  },

  watch: {
    y(to, from) {
      if (from === 0 && to !== 0) {
        this.goToSecondScreen()
        this.desktopMenuTl.reverse()
      }

      if (to < this.firstScreenScrollTarget && from >= this.firstScreenScrollTarget) {
        this.goToTop()
        this.openMenu()
      }
    }
  },

  beforeDestroy() {
    document.removeEventListener('scroll', this.getCurrentPosition)
    document.removeEventListener('scroll', () => this.closeMenu())
  },

  mounted() {
    this.createScrolling()
    this.firstScreenScrollTarget = window.innerHeight
    this.getCurrentPosition()
    this.makeDesktopMenuTimeline()
    if (this.onTheFirstScreen) this.desktopMenuTl.play()

    document.addEventListener('scroll', this.getCurrentPosition)
    document.addEventListener('scroll', () => this.closeMenu())
  },

  methods: {
    createScrolling() {
      const gsap = this.$gsap

      this.scrolling.disable = () => {
        if (this.scrolling.enabled) {
          this.scrolling.enabled = false
          window.addEventListener('scroll', gsap.ticker.tick, { passive: true })
          this.scrolling.events.forEach((e, i) =>
            (i ? document : window).addEventListener(e, this.prevent, { passive: false })
          )
        }
      }

      this.scrolling.enable = () => {
        if (!this.scrolling.enabled) {
          this.scrolling.enabled = true
          window.removeEventListener('scroll', gsap.ticker.tick)
          this.scrolling.events.forEach((e, i) => (i ? document : window).removeEventListener(e, this.prevent))
        }
      }
    },

    getCurrentPosition() {
      this.onTheFirstScreen = window.scrollY < this.firstScreenScrollTarget

      this.y = window.scrollY
    },

    makeDesktopMenuTimeline() {
      const menuWrapper = document.querySelector('._gsap-menu-wrapper')
      const centerElement = document.querySelector('._gsap-center-el')
      const bottomElement = document.querySelector('._gsap-bottom-el')
      const languages = document.querySelector('._gsap-languages')
      const languagesItems = document.querySelectorAll('._gsap-languages-item')
      const logoTree = document.querySelector('._gsap-tree-logo')
      const logoTreeLine = document.querySelector('._gsap-tree-logo-line')
      const logoText = document.querySelector('._gsap-logo-text')
      const menuList = document.querySelectorAll('._gsap-header-item')
      const menuForm = document.querySelector('._gsap-header-form')

      const timings = {
        wrapper: 0.8, // 0.6
        centerEl: 0.4, // 0.3
        bottomEl: 0.4, // 0.3
        langs: 0.4, // 0.3
        langsEl: 0.3, // 0.2
        tree: 0.4, // 0.3
        treeLine: 0.4, // 0.3
        text: 0.3, // 0.3
        listItem: 0.3, // 0.2
        form: 0.5 // 0.3
      }

      const tl = this.$gsap.matchMedia()
      const desktopMenuTl = this.$gsap.timeline({ paused: true })

      tl.add(`(min-width: ${this.desktopResolution}px)`, () => {
        desktopMenuTl
          .fromTo(menuWrapper, { width: 72, duration: timings.wrapper }, { width: 235, duration: timings.wrapper })
          .add(
            [
              this.$gsap.fromTo(
                centerElement,
                { opacity: 1, duration: timings.centerEl },
                { opacity: 0, duration: timings.centerEl }
              ),
              this.$gsap.fromTo(
                bottomElement,
                { opacity: 1, duration: timings.bottomEl },
                { opacity: 0, duration: timings.bottomEl }
              ),
              this.$gsap.fromTo(
                languages,
                { opacity: 0, maxHeight: 0, padding: 0, duration: timings.langs },
                { opacity: 1, maxHeight: 58, padding: '20px 0', duration: timings.langs }
              ),
              this.$gsap.fromTo(
                logoTree,
                { width: 48, height: 48, margin: '20px 12px', duration: timings.tree },
                { width: 100, height: 100, margin: '0 50px', duration: timings.tree }
              ),
              this.$gsap.fromTo(
                logoTreeLine,
                { width: 72, duration: timings.treeLine },
                { width: 0, duration: timings.treeLine }
              )
            ],
            '<'
          )
        desktopMenuTl.fromTo(
          languagesItems,
          { opacity: 0, y: -10, duration: timings.langsEl, stagger: 0.1 },
          { opacity: 1, y: 0, duration: timings.langsEl, stagger: 0.1 },
          0.6
        )
        desktopMenuTl.fromTo(
          logoText,
          { opacity: 0, y: -10, duration: timings.text },
          { opacity: 1, y: 0, duration: timings.text },
          0.75
        )
        desktopMenuTl.fromTo(
          menuList,
          { opacity: 0, y: -10, duration: timings.listItem, stagger: 0.05 },
          { opacity: 1, y: 0, duration: timings.listItem, stagger: 0.05 },
          0.9
        )
        desktopMenuTl.fromTo(
          menuForm,
          { opacity: 0, x: -690, duration: timings.form },
          { opacity: 1, x: 0, duration: timings.form },
          1.1
        )
      })

      this.desktopMenuTl = desktopMenuTl
    },

    openMenu() {
      this.desktopMenuTl.play()
    },

    closeMenu() {
      if (this.onTheFirstScreen) return

      this.desktopMenuTl.reverse()
    },

    goToTop() {
      if (!this.scrolling.enabled) return

      this.scrolling.disable()

      const mm = this.$gsap.matchMedia()
      mm.add(`(min-width: ${this.desktopResolution}px)`, () => {
        this.$gsap.to(window, {
          scrollTo: { y: 0 },
          onComplete: this.scrolling.enable,
          duration: 1
        })
      })
    },

    goToSecondScreen() {
      if (!this.scrolling.enabled) return

      this.scrolling.disable()

      const mm = this.$gsap.matchMedia()
      mm.add(`(min-width: ${this.desktopResolution}px)`, () => {
        this.$gsap.to(window, {
          scrollTo: { y: this.firstScreenScrollTarget + 1 },
          onComplete: this.scrolling.enable,
          duration: 1
        })
      })
    }
  }
}
