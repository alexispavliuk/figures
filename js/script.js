let canvas;
let context;
let parallelogramExists = false;
let coords = new Array();
let moving_root_id;
window.onload = function() {
    canvas = document.querySelector("canvas");
    context = canvas.getContext("2d");
    context.font = "18px";
    canvas.onclick = start;
    canvas.onmousedown = move;
    canvas.onmouseup = function() { canvas.onmousemove = null;};
    canvas.onmouseout = function() { canvas.onmousemove = null;};
    let clear_button = document.getElementById("clear_button");
    clear_button.addEventListener("click", clearCanvas);
    let about_button = document.getElementById("about_button");
    about_button.addEventListener("click", about);
    }
// allows user to draw circles at canvas
// while there is no 3 circles drawed by user we allow him to do that
function start(e) {
    // let`s find coordinates of user`s click
    let x = e.pageX - (document.documentElement.clientWidth - canvas.width)/2;
    let y = e.pageY - canvas.offsetTop;

    if (parallelogramExists) {
        // if parallelogram exists, do nothing
        return;
    }

    coords.push([x,y]);
    draw_red_circle(x,y);

    // if user drawed 3 circles - we should draw parallelogram
    if (coords.length == 3) {
        parallelogramExists = true;
        // calculate coords of 4th root
        x_fourth_root = coords[2][0] - coords[1][0] + coords[0][0];
        y_fourth_root = coords[2][1] - coords[1][1] + coords[0][1];
        coords.push([x_fourth_root, y_fourth_root]);
        draw_parallelogram();
    }
}
// draw parallelogram by 3 roots
function draw_parallelogram() {
    context.strokeStyle = '#7775f8';
    context.lineWidth = 3;

    context.beginPath();
    context.moveTo(coords[0][0], coords[0][1]);
    context.lineTo(coords[1][0], coords[1][1]);
    context.lineTo(coords[2][0], coords[2][1]);
    context.lineTo(x_fourth_root, y_fourth_root);
    context.lineTo(coords[0][0], coords[0][1]);
    context.stroke();

    // calculate square of parallelogram
    // We will use Heron's formula and calculate half of parallelogram`s square and then double it
    // first of all lets find lenght of 3 sides
    let a = Math.sqrt( Math.pow(coords[0][0] - coords[1][0], 2) + Math.pow(coords[0][1] - coords[1][1], 2) );
    let b = Math.sqrt( Math.pow(coords[1][0] - coords[2][0], 2) + Math.pow(coords[1][1] - coords[2][1], 2) );
    let c = Math.sqrt( Math.pow(coords[2][0] - coords[0][0], 2) + Math.pow(coords[2][1] - coords[0][1], 2) );
    // now calculate semi-perimeter
    let p = (a+b+c)/2;
    // find square
    let square = 2 * Math.sqrt( p*(p-a)*(p-b)*(p-c) );
    // call func to draw yellow circle
    draw_yellow_circle(square);
}
// draw yellow circle in the centre of paralellogram
function draw_yellow_circle(square) {
    // calculate coords of circle
    // it`s enough to find the middle of one of the diagonals
    x_circle = (coords[0][0] + coords[2][0])/2;
    y_circle = (coords[0][1] + coords[2][1])/2;
    // calculate radius 
    let radius = Math.sqrt( square / Math.PI );

    context.strokeStyle = 'yellow';
    context.lineWidth = 3;

    context.beginPath();
    context.arc(x_circle, y_circle, radius, 0, Math.PI * 2, true);
    context.stroke();
    context.fillText("S=" + Math.round(square), x_circle-11, y_circle+15);
    context.closePath();
}
function move(e) {
    // let`s find coordinates of user`s click
    let x = e.pageX - (document.documentElement.clientWidth - canvas.width)/2;
    let y = e.pageY - canvas.offsetTop;
    // let`s check if user pressed on one of circles
    moving_root_id = check_pressing_on_circles(x,y);
    if (moving_root_id != -1) {
        canvas.onmousemove = render;
    }
}
function render(e) {
    // let`s find coordinates of user`s click
    let x = e.pageX - (document.documentElement.clientWidth - canvas.width)/2;
    let y = e.pageY - canvas.offsetTop;
    let dx = x - coords[moving_root_id][0];
    let dy = y - coords[moving_root_id][1];
    // cleaning canvas before rendering
    clearCanvas();
    // logic of moving parallelogram
    if (moving_root_id == 0) {
        coords[0][0] += dx;
        coords[1][0] += dx;
        coords[0][1] += dy;
        coords[1][1] += dy;
        draw_all_circles_from_coords();
    }
    // 2 and 3 roots allways move together 
    if (moving_root_id == 1 || moving_root_id == 2) {
        coords[1][0] += dx;
        coords[2][0] += dx;
        coords[1][1] += dy;
        coords[2][1] += dy;
        draw_all_circles_from_coords();
    }
    draw_parallelogram();
}
function draw_red_circle(x,y) {
    context.strokeStyle = '#ff2626';

    context.beginPath();
    context.arc(x, y, 5.5, 0, Math.PI * 2, true);
    context.stroke();
    context.fillText("x=" + Math.round(x), x-11, y+15);
    context.fillText("y=" + Math.round(y), x-11, y+25);
    context.closePath();
}
function draw_all_circles_from_coords() {
    draw_red_circle(coords[0][0], coords[0][1]);
    draw_red_circle(coords[1][0], coords[1][1]);
    draw_red_circle(coords[2][0], coords[2][1]);
}
function check_pressing_on_circles(x,y) {
    for (let i = 0; i < coords.length - 1; i++) {
        if (x  > coords[i][0]-5 && x < coords[i][0] + 5 && y > coords[i][1] - 5 && y < coords[i][1] + 5 ) {
            return i;
        }
    }
    return -1;
}
function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    if (canvas.onmousemove != render) {
        parallelogramExists = false;
        coords = [];
    }
}
function about() {
    let instruction= "Welcome!\n" +
                    "This program builds different figures.\n" +
                    "Just click on canvas and you will see red circles with coords.\n" +
                    "It`s enough to define 3 points to build blue parallelogram and yellow circle.\n" +
                    "These new figures have general center of mass and the same square.\n" +
                    "Value of square you will see in the center of figures.\n"+
                    "Then you can move roots of parallelogram.\n" + 
                    "Notice: 2nd and 3rd roots move at the same way.\n " +
                    "But anyway you can build any parallelogram you want.\n"
    let author = "Author: Oleksii Pavliuk\n" +
                    "Contact: https://t.me/c0ffin_dancer";	 
    alert(instruction);
    alert(author);
}