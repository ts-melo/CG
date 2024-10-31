function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  if (!gl) {
      throw new Error('WebGL not supported');
  }

  // Load shader sources
  const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  const program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  // Set up buffer and attribute pointers
  const positionBuffer = gl.createBuffer();
  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
  const colorUniformLocation = gl.getUniformLocation(program, `color`);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let colorVector = [0.0, 0.0, 0.0];
  gl.uniform3fv(colorUniformLocation, colorVector);

  // Function to normalize the coordinates
  function normalizeCoordinates(x, y) {
    return [
      (x / canvas.width) * 2 - 1,
      -((y / canvas.height) * 2 - 1)
    ];
  }

  // Draw a point at the given normalized coordinates
  function drawPoint(x, y) {
    const [normalizedX, normalizedY] = normalizeCoordinates(x, y);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([normalizedX, normalizedY]), gl.STATIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, 1);
  }

  // Draw line between two points given in pixel coordinates
  function drawLine(start, end) {
    const [x1, y1] = normalizeCoordinates(...start);
    const [x2, y2] = normalizeCoordinates(...end);

    const linePoints = [
      x1, y1,
      x2, y2,
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(linePoints), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_STRIP, 0, 2); // Use LINE_STRIP to draw a line
  }

  function drawTriangle(points) {
    const trianglePoints = points.map(point => normalizeCoordinates(point[0], point[1])).flat();

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(trianglePoints), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 3); // Use TRIANGLES para desenhar um triângulo
}

  

let currentColor = [0.0, 0.0, 0.0]; // Cor inicial
let currentThickness = 1; // Espessura inicial
let changingColor = false; // Estado de mudança de cor
let changingThickness = false; // Estado de mudança de espessura

// Handle color change on key press
document.addEventListener("keydown", (event) => {
  if (event.key === 'k' || event.key === 'K') {
    changingColor = true;
    changingThickness = false; // Desativar mudança de espessura
  } else if (event.key === 'e' || event.key === 'E') {
    changingThickness = true;
    changingColor = false; // Desativar mudança de cor
  }

  if (changingColor) {
    switch(event.key) {
      case "0": currentColor = [0.0, 0.0, 0.0]; break;
      case "1": currentColor = [1.0, 0.0, 0.0]; break;
      case "2": currentColor = [0.0, 1.0, 0.0]; break;
      case "3": currentColor = [0.0, 0.0, 1.0]; break;
      case "4": currentColor = [1.0, 1.0, 0.0]; break;
      case "5": currentColor = [0.0, 1.0, 1.0]; break;
      case "6": currentColor = [1.0, 0.0, 1.0]; break;
      case "7": currentColor = [1.0, 0.5, 0.5]; break;
      case "8": currentColor = [0.5, 1.0, 0.5]; break;
      case "9": currentColor = [0.5, 0.5, 1.0]; break;
    }
    gl.uniform3fv(colorUniformLocation, currentColor);
    
  }

  if (changingThickness) {
    if (event.key >= '1' && event.key <= '9') {
      currentThickness = parseInt(event.key); // Define a espessura com base na tecla pressionada
    }
  }
});

// Handle mouse click for drawing lines or triangles
let clicks = [];
canvas.addEventListener("mousedown", (event) => {
  clicks.push([event.offsetX, event.offsetY]);
  gl.uniform3fv(colorUniformLocation, currentColor);
  gl.lineWidth(currentThickness);
  drawPoint(event.offsetX, event.offsetY);
  
  if (clicks.length === 2) {
    gl.uniform3fv(colorUniformLocation, currentColor);
    gl.lineWidth(currentThickness); // Aplica a espessura atual ao traçado
    drawLine(clicks[0], clicks[1]);
  } else if (clicks.length === 3) {
    gl.uniform3fv(colorUniformLocation, currentColor); // Use the current color for the triangle
    gl.lineWidth(currentThickness);
    drawTriangle(clicks);
    clicks = [];  // Reset clicks after drawing the triangle
  }
  gl.uniform3fv(colorUniformLocation, currentColor); // Set color to current color after drawing
});

}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

main();
