export const canvas = document.getElementById("board");
export const ctx = canvas.getContext('2d');

export const board = {
    color: '#f9f9f9',

    get width() {
        return canvas.width;
    },
    get height() {
        return canvas.height;
    },

    setSize(w=800, h=600) {
        canvas.width = w;
        canvas.height = h;
    },
    render() {
        ctx.clearRect(0, 0, this.width, this.height);
    }
};

export default board;