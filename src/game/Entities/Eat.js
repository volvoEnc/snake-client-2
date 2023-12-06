export default class Eat {

    radius = 8
    constructor(scene, {id, mx, my}) {
        this.scene = scene;
        this.id = id
        this.mx = mx
        this.my = my
    }

    render() {
        this.ceil = this.scene.add.circle(this.mx * this.scene.width + (this.scene.width / 2), this.my * this.scene.height + (this.scene.height / 2), 8, 0x49ff03).setOrigin(0.5).setStrokeStyle(1, 0x000000);
        this.scene.tweens.add({
            targets: this.ceil,
            ease: 'Linear',
            duration: 250,
            repeat: -1,
            scale: 1.2,
            yoyo: true
        });
    }

    destroy() {
        if(this.ceil) {
            this.ceil.destroy(true)
        }
    }
}