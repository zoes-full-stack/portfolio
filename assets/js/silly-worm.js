const Wormco = {
  state: {
    animation: "sleeping",
    frequency: 3,
    amplitude: 0.1,
    xstart: 207, 
    ystart: 171,
    length: 110,
    offset: 0,
    fps: 60,
  },

    init() {
        this.cacheDOM();
        this.bindEvents();
        this.setAnimation("sleeping");
    },

    cacheDOM() {
        this.container = document.querySelector('.wormco-container');
        this.character = this.container.querySelector('.character');
        this.computer = this.container.querySelector('.computer');
        this.armL = this.container.querySelector('.arm--left .arm-path');
        this.armR = this.container.querySelector('.arm--right .arm-path');
        this.sliders = this.container.querySelector('.sliders');
        this.buttons = this.container.querySelectorAll('.controls button');
    },

    bindEvents() {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const speed = btn.getAttribute('data-speed') || 60;
                this.setAnimation(btn.getAttribute('data-anim'), parseInt(speed));
            });
        });

        this.container.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.state[e.target.name] = parseFloat(e.target.value);
            });
        });
    },

    createCurve(x, offset, inverted = false) {
        const { frequency, ystart, xstart, amplitude } = this.state;
        const phase = inverted ? Math.sqrt(x * frequency) - offset : Math.sqrt(x * frequency) + offset;
        return ystart - (Math.sin(phase)) * (x - xstart) * amplitude;
    },

    updateArms() {
        const { xstart, ystart, length, animation, offset } = this.state;
        
        // Handle static arm positions for non-typing states
        if (animation === 'waiting') {
            this.armL.setAttribute('d', "M175.27,152.06s55.19,87.24-65.77,74.44");
            this.armR.setAttribute('d', "M207.26,171.26s45.19,85-75.76,72.24");
            return;
        }
        if (animation === 'thinking' || animation === 'passive' || animation === 'sleeping') {
            const pathL = "M175.93,152.78s-10.18,82-36.43,103.72";
            const pathR = animation === 'thinking' ? "M207.48,172.34s-76,114.16-93-9.84" : "M207.93,172c.57-.48,11.3,86.45-23.43,112.52";
            this.armL.setAttribute('d', pathL);
            this.armR.setAttribute('d', pathR);
            this.armR.className.baseVal = animation === 'thinking' ? "arm-path arm-thinking-right" : "arm-path";
            return;
        }

        // Handle dynamic typing arms
        let x = xstart;
        let dataL = `M ${xstart} ${ystart}`;
        let dataR = `M ${xstart} ${ystart}`;

        while (x < xstart + length) {
            const newYL = this.createCurve(x, offset);
            const newYR = this.createCurve(x, offset, true);
            dataL += ` L ${x} ${newYL}`;
            dataR += ` L ${x} ${newYR}`;
            x += 1;
        }

        this.armL.setAttribute('d', dataL);
        this.armR.setAttribute('d', dataR);
        this.armL.className.baseVal = "arm-path arm-typing-left";
        this.armR.className.baseVal = "arm-path arm-typing-right";
    },

    loop() {
        if (this.state.animation !== "typing" && this.state.animation !== "stressed") return;

        this.state.offset += 0.3;
        this.updateArms();

        setTimeout(() => {
            requestAnimationFrame(() => this.loop());
        }, 1000 / this.state.fps);
    },

    setAnimation(anim, speed = 60) {
        this.state.animation = anim;
        this.state.fps = speed;

        // Sync CSS classes
        this.character.className.baseVal = `character -${anim}`;
        this.computer.className.baseVal = `computer -${anim}`;
        
        // Show/Hide sliders
        this.sliders.style.display = anim === 'stressed' ? 'flex' : 'none';

        if (anim === "typing" || anim === "stressed") {
            this.loop();
        } else {
            this.updateArms();
        }
    }
};

// Start the app
document.addEventListener('DOMContentLoaded', () => Wormco.init());
