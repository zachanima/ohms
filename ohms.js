var scale = 4;



function Game() {
  this.hubs = [];
  this.lastDelta = 0;

  this.width = canvas.width / (8 * scale) - 1;
  this.height = canvas.height / (8 * scale) - 1;

  for (var y = 0; y < this.height; ++y) {
    for (var x = 0; x < this.width; ++x) {
      this.hubs.push(new Hub(x * 8 * scale + 16, y * 8 * scale + 16));
    }
  }

  this.hubs[2 * this.width + 2].wires.push(this.hubs[2 * this.width + 3]);
  this.hubs[2 * this.width + 3].wires.push(this.hubs[3 * this.width + 4]);
  this.hubs[3 * this.width + 4].wires.push(this.hubs[4 * this.width + 4]);
  this.hubs[4 * this.width + 4].wires.push(this.hubs[5 * this.width + 3]);
  this.hubs[5 * this.width + 3].wires.push(this.hubs[5 * this.width + 2]);
  this.hubs[5 * this.width + 2].wires.push(this.hubs[4 * this.width + 1]);
  this.hubs[4 * this.width + 1].wires.push(this.hubs[3 * this.width + 1]);
  this.hubs[3 * this.width + 1].wires.push(this.hubs[2 * this.width + 2]);

  this.packets = [];
  this.packets.push(new Packet(this.hubs[2 * this.width + 2]));
}



function Hub(x, y) {
  this.x = x;
  this.y = y;
  this.wires = [];

  this.draw = function() {
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(this.x, this.y, scale, 0, 2 * Math.PI);
    context.fill();
  }
}



function Packet(hub) {
  this.hub = hub;
  this.target = hub.wires[0];
  this.x = hub.x;
  this.y = hub.y;
  this.progress = 0;
  this.speed = 1;

  this.draw = function() {
    context.strokeStyle = 'white';
    context.beginPath();
    context.arc(this.x, this.y, 2 * scale, 0, 2 * Math.PI);
    context.stroke();
  }

  this.update = function() {
    this.x = this.hub.x * (1 - this.progress) + this.target.x * this.progress;
    this.y = this.hub.y * (1 - this.progress) + this.target.y * this.progress;
    this.progress += game.delta * this.speed;

    if (this.progress >= 1) {
      this.progress = 0;
      this.hub = this.target;
      this.target = this.hub.wires[0];
    }
  }
}



function start() {
  window.game = new Game();
}



function loop(timestamp) {
  game.delta = (timestamp - game.lastDelta) * 0.001;
  game.lastDelta = timestamp;

  // Update packets.
  for (var i in game.packets) {
    game.packets[i].update();
  }

  // Clear canvas.
  context.fillStyle = 'darkslategray';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw hubs.
  for (var i in game.hubs) {
    game.hubs[i].draw();
  }

  // Draw wires.
  context.strokeStyle = 'green';
  context.lineCap = 'round';
  for (var i in game.hubs) {
    var hub = game.hubs[i];
    for (var j in hub.wires) {
      var other = hub.wires[j];
      context.beginPath();
      context.lineWidth = 4;
      context.moveTo(hub.x, hub.y);
      context.lineTo(other.x, other.y);
      context.stroke();
    }
  }

  // Draw packets.
  for (var i in game.packets) {
    game.packets[i].draw();
  }

  requestAnimationFrame(loop);
}



jQuery(function() {
  window.canvas = document.getElementById('ohms');
  canvas.width = 1280;
  canvas.height = 720;
  window.context = canvas.getContext('2d');

  start();

  requestAnimationFrame(loop);
});
