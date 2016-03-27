/**
 * Sound class
 * 
 * @type {{
 *  sounds: {
 *      collide: {wall: Element, player: Element, brick: Element}
 *  },
 *  play: (function(String, String))}}
 */
export const sound = {
    sounds: {
        collide: {
            wall: document.getElementById('collide-walls'),
            player: document.getElementById('collide-player'),
            brick: document.getElementById('collide-brick')
        }
    },

    /**
     * 
     * @param {String} action
     * @param {String} type
     * @returns {*|void}
     */
    play(action, type) {

        if (this.sounds.hasOwnProperty(action) && this.sounds[action].hasOwnProperty(type)) {
            this.sounds[action][type].currentTime = 0;
            this.sounds[action][type].volume = 0.6;
            return this.sounds[action][type].play();
        }

        throw new Error(`Sound with action: '${action}' and type: '${type}' is not defined`);
    }
};

export default sound;