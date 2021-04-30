class Sprite {
    constructor(config) {
        this.sprite = new Image();
        this.sprite.src = config.image;
        this.config = config;
        this.frameState = {};
        this.lastFrameChangeDate = new Date();
    }

    getFrame(type) {
        const { frameWidth, frameHeight, animations, timeout } = this.config;
        const { x, y, frameCount } = animations[type];
        const { frameState } = this;
        let currentFrame = frameState[type] ? frameState[type] : 0;
        currentFrame = currentFrame === frameCount ? 0 : currentFrame;
        const frame = {
            x: x + currentFrame * frameWidth,
            y: y,
            w: frameWidth,
            h: frameHeight,
            image: this.sprite
        }
        if (new Date() - this.lastFrameChangeDate > timeout) {
            frameState[type] = currentFrame + 1;
            this.lastFrameChangeDate = new Date();
        }
        return frame;
    }
}