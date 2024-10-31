function main() {
    const canvas = document.querySelector('canvas')
    const gl = canvas.getContext('webgl2')
  
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }
  
    var vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
    var fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
  
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    var program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
  
    const positionBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();
    const circlePositionBuffer = gl.createBuffer();
    const circleColorBuffer = gl.createBuffer();
    const trianglePositionBuffer = gl.createBuffer();
    const triangleColorBuffer = gl.createBuffer();

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    
  
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.viewport(0,0, gl.canvas.width, gl.canvas.height);
  
    const n = 100; // Number of segments
    //caule
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangleVertices(gl, -0.1, -1, 0.02, 1);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    setRectangleColor(gl, [0, 0.7, 0]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    //
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    setCircleVertices(gl, 0.02, -0.5, n, 0.08);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
    setCircleColor(gl, n, [0, 0.7, 0]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);

    // Triangle
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePositionBuffer);
    setTriangleVertices(gl, -0.09, -0.5, 0.0, -0.42, 0.0, -0.58); // Define triangle vertices
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    setTriangleColor(gl, [0, 0.7, 0]); // Blue color
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3); // 3 vertices for the triangle

    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePositionBuffer);
    setTriangleVertices(gl, 0.2, -0.5, 0.0, -0.42, 0.0, -0.58); // Define triangle vertices
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleColorBuffer);
    setTriangleColor(gl, [0, 0.7, 0]); // Blue color
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    
    // Draw the triangle
    gl.drawArrays(gl.TRIANGLES, 0, 3); // 3 vertices for the triangle
    //petalas

    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    setCircleVertices(gl, -0.02, 0.0525, n, 0.1);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
    setCircleColor(gl, n, [1, 0, 0.5]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);

    //
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    setCircleVertices(gl, -0.02, -0.0525, n, 0.1);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
    setCircleColor(gl, n, [1, 0, 0.5]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);

    //
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    setCircleVertices(gl, -0.11625, 0.08325, n, 0.1);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
    setCircleColor(gl, n, [1, 0, 0.5]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);

    //
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    setCircleVertices(gl, -0.1775, 0, n, 0.1);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
    setCircleColor(gl, n, [1, 0, 0.5]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);

    //
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    setCircleVertices(gl, -0.11625, -0.08325, n, 0.1);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
    setCircleColor(gl, n, [1, 0, 0.5]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2);

    // miolo
    gl.bindBuffer(gl.ARRAY_BUFFER, circlePositionBuffer);
    setCircleVertices(gl, -0.09, 0, n, 0.1);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);
 
    gl.bindBuffer(gl.ARRAY_BUFFER, circleColorBuffer);
    setCircleColor(gl, n, [1, 0.9, 0]);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
     // Draw the circle
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n + 2); // +2 for center and closing the circle
    
    
  
   
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
  
  function setRectangleVertices(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      x1, y1,
      x2, y1,
      x1, y2,
      x1, y2,
      x2, y1,
      x2, y2,
    ]), gl.STATIC_DRAW);
  }
  function setRectangleColor(gl, color) {
    colorData = [];
    for (let triangle = 0; triangle < 2; triangle++) {
      for (let vertex = 0; vertex < 3; vertex++)
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
  }
  function setCircleVertices(gl, centerX, centerY, n, radius) {
    let vertexData = [centerX,centerY];
    for (let i = 0; i <= n; i++) { // Including the last vertex to close the circle
        const angle = (i * 2 * Math.PI) / n;
        vertexData.push(centerX + radius * Math.cos(angle));
        vertexData.push(centerY + radius * Math.sin(angle));
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);   

}
function setCircleColor(gl, n, color) {
    colorData = [];
    for (let i = 0; i <= n; i++) { // Include the color for the center and each segment
        colorData.push(...color);
    }
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
}

function setTriangleVertices(gl, x1, y1, x2, y2, x3, y3) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1, // Vertex 1
        x2, y2, // Vertex 2
        x3, y3  // Vertex 3
    ]), gl.STATIC_DRAW);
}

function setTriangleColor(gl, color) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        ...color, // Color for vertex 1
        ...color, // Color for vertex 2
        ...color  // Color for vertex 3
    ]), gl.STATIC_DRAW);
}

    
main();