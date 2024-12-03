function main() {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });

  if (!gl) {
    throw new Error('WebGL not supported');
  }

  var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  var program = createProgram(gl, vertexShader, fragmentShader);

  gl.useProgram(program);

  const positionBuffer = gl.createBuffer();

  const positionLocation = gl.getAttribLocation(program, `position`);
  gl.enableVertexAttribArray(positionLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


  const matrixUniformLocation = gl.getUniformLocation(program, `matrix`);
  const colorUniformLocation = gl.getUniformLocation(program, `color`);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  let positionVector = [];
  const numSegments = 50; // Higher number for a smoother circle
  const radius = 0.3;

  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * 2 * Math.PI;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    positionVector.push(x, y);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positionVector), gl.STATIC_DRAW);


  let rectanglePositionVector = [
    -0.75, 0.5,
    -0.75, 0,
    -0.4, 0.5,
    -0.75, 0,
    -0.4, 0,
    -0.4, 0.5,
  ];
  const rectanglePositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectanglePositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectanglePositionVector), gl.STATIC_DRAW);

  let rectangle2PositionVector = [
    1, 0.5,
    1, 0,
    0.7, 0.5,
    1, 0,
    0.7, 0,
    0.7, 0.5,
  ];
  const rectangle2PositionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, rectangle2PositionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(rectangle2PositionVector), gl.STATIC_DRAW);


  let r1y = 0.1;
  let r2y = 0.0;

  window.addEventListener("keydown", (event) => {
    switch (event.key) {
      case "ArrowUp":
        r2y += 0.05;  // Move retângulo direito para cima
        break;
      case "ArrowDown":
        r2y -= 0.05;  // Move retângulo direito para baixo
        break;
      case "w":
        r1y += 0.05;  // Move retângulo esquerdo para cima
        break;
      case "a":
        r1y -= 0.05;  // Move retângulo esquerdo para baixo
        break;
    }
  });

  let circle = {
    x: 0.0,
    y: 0.0,
    radius: 0.2,
    velocityX: 0.01,
    velocityY: 0.02,
  };
  const rect1BoundingBox = getBoundingBoxFromVertices(rectanglePositionVector);
  rect1BoundingBox.y += r1y;
  const rect2BoundingBox = getBoundingBoxFromVertices(rectangle2PositionVector);
  rect2BoundingBox.y += r2y;

  function drawSquare() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    const isCollision1 = checkCircleRectangleCollision(circle, rect1BoundingBox, r1y);
    const isCollision2 = checkCircleRectangleCollision(circle, rect2BoundingBox, r2y);

    if (isCollision1 || isCollision2) {
      circle.velocityX = -circle.velocityX; 
      circle.velocityY = -circle.velocityY;  
      circle.y += circle.velocityY* 0.05;
      circle.x += circle.velocityX * 0.05;
    }
    if (circle.y > 1.0 || circle.y < -1.0) {
      circle.velocityY = -circle.velocityY;
    }
    circle.y += circle.velocityY;
    if (circle.x > 1.0 || circle.x < -1.0) {
      circle.velocityX = -circle.velocityX;
    }

    // Update circle position
    circle.y += circle.velocityY;
    circle.x += circle.velocityX;


    // Desenha o círculo
    let matrix = m4.identity();
    matrix = m4.translate(matrix, circle.x, circle.y, 0.0);
    //matrix = m4.zRotate(matrix, degToRad(theta));
    matrix = m4.scale(matrix, 0.25, 0.25, 1.0);
    gl.uniformMatrix4fv(matrixUniformLocation, false, matrix);
    let colorVector = [0, 0, 0];
    gl.uniform3fv(colorUniformLocation, colorVector);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, positionVector.length / 2);


    // Desenha o retângulo direito (movido com 'ArrowUp' e 'ArrowDown')
    let rectangleMatrix2 = m4.identity();
    rectangleMatrix2 = m4.translate(rectangleMatrix2, rect2BoundingBox.x, rect2BoundingBox.y + r2y, 0.0);
    rectangleMatrix2 = m4.scale(rectangleMatrix2, rect2BoundingBox.width, rect2BoundingBox.height, 1.0);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rectangleMatrix2);
    gl.uniform3fv(colorUniformLocation, [0.0, 0.5, 0.5]);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangle2PositionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Desenha o retângulo esquerdo (movido com 'w' e 's')
    let rectangleMatrix = m4.identity();
    rectangleMatrix = m4.translate(rectangleMatrix, rect1BoundingBox.x, rect1BoundingBox.y + r1y, 0.0);
    rectangleMatrix = m4.scale(rectangleMatrix, rect1BoundingBox.width, rect1BoundingBox.height, 1.0);
    gl.uniformMatrix4fv(matrixUniformLocation, false, rectangleMatrix);
    gl.uniform3fv(colorUniformLocation, [0.0, 0.5, 0.5]);
    gl.bindBuffer(gl.ARRAY_BUFFER, rectanglePositionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);


    requestAnimationFrame(drawSquare);
  }
  drawSquare();
}
function checkCircleRectangleCollision(circle, rect, shift) {
  const bbox = {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };

  let distX = Math.abs(circle.x - (bbox.x));
  let distY = Math.abs(circle.y - (bbox.y));

  if (distX <= (bbox.width / 2 + circle.radius) && distY <= (bbox.height / 2 + circle.radius)) {
    return true;
  }
  return false;
}
// Function to get the bounding box from a rectangle's vertex array
function getBoundingBoxFromVertices(vertices) {
  const xValues = [vertices[0], vertices[2], vertices[4], vertices[6]];
  const yValues = [vertices[1], vertices[3], vertices[5], vertices[7]];

  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  const yMin = Math.min(...yValues);
  const yMax = Math.max(...yValues);

  return {
    x: xMin,
    y: yMin,
    width: Math.abs(xMax - xMin),
    height: Math.abs(yMax - yMin)
  };
}


function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

var m4 = {
  identity: function () {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
  },

  multiply: function (a, b) {
    var a00 = a[0 * 4 + 0];
    var a01 = a[0 * 4 + 1];
    var a02 = a[0 * 4 + 2];
    var a03 = a[0 * 4 + 3];
    var a10 = a[1 * 4 + 0];
    var a11 = a[1 * 4 + 1];
    var a12 = a[1 * 4 + 2];
    var a13 = a[1 * 4 + 3];
    var a20 = a[2 * 4 + 0];
    var a21 = a[2 * 4 + 1];
    var a22 = a[2 * 4 + 2];
    var a23 = a[2 * 4 + 3];
    var a30 = a[3 * 4 + 0];
    var a31 = a[3 * 4 + 1];
    var a32 = a[3 * 4 + 2];
    var a33 = a[3 * 4 + 3];
    var b00 = b[0 * 4 + 0];
    var b01 = b[0 * 4 + 1];
    var b02 = b[0 * 4 + 2];
    var b03 = b[0 * 4 + 3];
    var b10 = b[1 * 4 + 0];
    var b11 = b[1 * 4 + 1];
    var b12 = b[1 * 4 + 2];
    var b13 = b[1 * 4 + 3];
    var b20 = b[2 * 4 + 0];
    var b21 = b[2 * 4 + 1];
    var b22 = b[2 * 4 + 2];
    var b23 = b[2 * 4 + 3];
    var b30 = b[3 * 4 + 0];
    var b31 = b[3 * 4 + 1];
    var b32 = b[3 * 4 + 2];
    var b33 = b[3 * 4 + 3];
    return [
      b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
      b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
      b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
      b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,
      b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
      b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
      b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
      b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,
      b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
      b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
      b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
      b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,
      b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
      b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
      b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
      b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
    ];
  },

  translation: function (tx, ty, tz) {
    return [
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      tx, ty, tz, 1,
    ];
  },

  xRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      1, 0, 0, 0,
      0, c, s, 0,
      0, -s, c, 0,
      0, 0, 0, 1,
    ];
  },

  yRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, 0, -s, 0,
      0, 1, 0, 0,
      s, 0, c, 0,
      0, 0, 0, 1,
    ];
  },

  zRotation: function (angleInRadians) {
    var c = Math.cos(angleInRadians);
    var s = Math.sin(angleInRadians);

    return [
      c, s, 0, 0,
      -s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
    ];
  },

  scaling: function (sx, sy, sz) {
    return [
      sx, 0, 0, 0,
      0, sy, 0, 0,
      0, 0, sz, 0,
      0, 0, 0, 1,
    ];
  },

  translate: function (m, tx, ty, tz) {
    return m4.multiply(m, m4.translation(tx, ty, tz));
  },

  xRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.xRotation(angleInRadians));
  },

  yRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.yRotation(angleInRadians));
  },

  zRotate: function (m, angleInRadians) {
    return m4.multiply(m, m4.zRotation(angleInRadians));
  },

  scale: function (m, sx, sy, sz) {
    return m4.multiply(m, m4.scaling(sx, sy, sz));
  },

};

function radToDeg(r) {
  return r * 180 / Math.PI;
}

function degToRad(d) {
  return d * Math.PI / 180;
}

main();