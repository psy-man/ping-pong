/**
 * Canvas tag
 */
export const canvas = document.getElementById("board");

/**
 * Context
 */
export const ctx = canvas.getContext('2d');


/**
 * Game board
 */
export const board = {

  /**
   * Returns canvas width
   *
   * @returns {Number}
   */
  get width() {
    return canvas.width;
  },

  /**
   * Returns canvas height
   *
   * @returns {Number}
   */
  get height() {
    return canvas.height;
  },

  /**
   * Set the size of canvas
   *
   * @param {Number} w [w=800]
   * @param {Number} h [h=600]
   */
  setSize(w = 800, h = 600) {
    canvas.width = w;
    canvas.height = h;
  },

  /**
   * Clear the canvas
   */
  render() {
    ctx.clearRect(0, 0, this.width, this.height);
  }
};


export default board;