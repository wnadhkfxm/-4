
var gl;
var delay = 10; //딜레이 10으로 설정
var primitive_selection = "square";
var color_selection = [230.0/255.0, 38.0/255.0, 31.0/255.0, 1.0 ];
var canvas;
var vBuffer, cBuffer;
var isMouseDown = false;

var program;
var vertices = [];
var vertex_colors = [];

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }

  //
  //  webgl구성
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  //  쉐이더와 초기 속성 버퍼를 로드

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);


  // 정점을 고정할 버퍼 생성
  vBuffer = gl.createBuffer();

  // 색상을 고정할 버퍼 생성
  cBuffer = gl.createBuffer();

  // 정점, 색깔, 그리고 gl을 위한 셋 속성 생성
  // 정점업데이트

  // 키보드랑 마우스 핸들러 설정
  setEventHandlers();

  render();
}

function updateVertices(program) {
  // ---- 버텍스 버퍼 ---- //

  // 활성화를 위해 버퍼를 바인드
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

  // 데이터를 배열로 gl에 전송

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  //셰이더 변수를 데이터 버퍼와 연결

  // 정점 위치의 셰이더 변수('vPosition') 위치를 가져옴
  var vPosition = gl.getAttribLocation(program, "vPosition");

  // 렌더링에 사용되는 정점 속성 정보(배열)를 지정
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

  //지정된 특성 이름으로 이 특성 사용
  gl.enableVertexAttribArray(vPosition);


  // 여기서부터는 색상 버퍼, 위와 유사하지만 속성이 아니라 색상을 설정

  // 활성화하기 위해 버퍼 바인드
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

  // 색상 데이터를 gl에 배열로 전송
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_colors), gl.STATIC_DRAW);

  // 색상 속성의 위치('vColor')를 가져옴
  var vColor = gl.getAttribLocation(program, "vColor");

  // 렌더링에 사용되는 정점 색상 속성 정보(배열)를 지정
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

  //위와 동일하게 지정된 특성 이름으로 사용
  gl.enableVertexAttribArray(vColor);
};

//사각형 및 점에 대한 별도의 배열 추적
function addPrimitive(x, y, color, type) {
  var size = 0.03;
  var num_vertices_added = 0;

  if (type === "square") {
    vertices.push(x - size, y       );
    vertices.push(x       , y + size);
    vertices.push(x       , y - size);

    vertices.push(x       , y + size);
    vertices.push(x       , y - size);
    vertices.push(x + size, y       );

    num_vertices_added = 6;
  }
  else if (type === "triangle") {//추가적인 옵션인 triangle을 위한 else if 공간, 다른 옵션들인 brush, point도 이를 통해 구현 가능
  }
  else {
    console.error("ERROR:", "unknown primitive type:", type)
  }

  for (var i = 0; i < num_vertices_added; i++) {
    vertex_colors.push(color[0], color[1], color[2], color[3]);
  }
}

function getWindowCoords(event) {
  window_coords = {};

  // 이를 통해 문서에서 오프셋을 설명할 수 있음
  const rect = document.getElementById("gl-canvas").getBoundingClientRect(); // getBoundingClientRect는 엘리먼트의 크기와 뷰포트에 상대적인 위치 정보를 제공하는 객체를 반환
  window_coords.x = event.clientX - rect.left;
  window_coords.y = event.clientY - rect.top; 

  return window_coords;
}

function paintAtMouse(mouseEvent) {
  // --- 마우스 현재 위치 획득하게 해주는 함수 --- //
  var window_coords = getWindowCoords(mouseEvent);
  var converted_coords = displayToNDC(window_coords.x, window_coords.y, canvas.width, canvas.height);

  // --- 사각형 그리기 --- //
  addPrimitive(converted_coords.x, converted_coords.y, color_selection, primitive_selection);
}

function setEventHandlers() {//이벤트 핸들러 설정
  document.getElementById("gl-canvas").addEventListener("click", function() {
  });

  // 캔버스가 아닌 곳에 이벤트(마우스업) 리스너를 의도적으로 추가 이렇게 하면 마우스를 캔버스 밖으로 이동시키는 경우 경우 텍스트에 데이터가 계속 채워지지 않음.
  
  document.addEventListener("mouseup", function() {
    isMouseDown = false;
  });

  document.getElementById("gl-canvas").addEventListener("mousedown", function(event) {
    isMouseDown = true;

    paintAtMouse(event);
  });

  document.getElementById("gl-canvas").addEventListener("mousemove", function(event){
    if(isMouseDown) {
      paintAtMouse(event)
    }
  });

  // 초기 유형 선택이 변경될 때의 트리거


  // 색상 버튼 핸들, 조작하는 함수들
  document.getElementById("btn-red").addEventListener("click",         
    function(){ color_selection = [230.0/255.0, 38.0/255.0, 31.0/255.0, 1.0 ] });
  document.getElementById("btn-orange").addEventListener("click",      
    function(){ color_selection = [235.0/255.0, 117.0/255.0, 50.0/255.0, 1.0] });
  document.getElementById("btn-yellow").addEventListener("click",      
    function(){ color_selection = [247.0/255.0, 208.0/255.0, 56.0/255.0, 1.0] });
  document.getElementById("btn-light-green").addEventListener("click", 
    function(){ color_selection = [163.0/255.0, 224.0/255.0, 72.0/255.0, 1.0] });
  document.getElementById("btn-sea-green").addEventListener("click",   
    function(){ color_selection = [73.0/255.0, 218.0/255.0, 154.0/255.0, 1.0] });
  document.getElementById("btn-light-blue").addEventListener("click",  
    function(){ color_selection = [52.0/255.0, 187.0/255.0, 230.0/255.0, 1.0] });
  document.getElementById("btn-blue").addEventListener("click",        
    function(){ color_selection = [67.0/255.0, 85.0/255.0, 219.0/255.0, 1.0 ] });
  document.getElementById("btn-magenta").addEventListener("click",     
    function(){ color_selection = [210.0/255.0, 59.0/255.0, 231.0/255.0, 1.0] });
}

// 이 함수는 디스플레이 좌표가 입력으로 들어올것으로 예상함
function displayToNDC(x, y, width, height) {
  converted_coords = {};
  converted_coords.x = -1.0 + (2.0 * x/width);
  converted_coords.y = 1.0 - (2.0 * y/height);
  return converted_coords;
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  updateVertices(program);

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);

  setTimeout(//타임아웃 설정
    function () { requestAnimFrame(render); }, delay
  );
}

function test_performance(){
  var num_primitives = 1e6;

  var before = new Date();
  for(var i = 0; i < num_primitives; i++){
    c = displayToNDC(i, i, num_primitives, num_primitives);
    addPrimitive(c.x, c.y, [0.0, 0.0, 0.0, 1.0], primitive_selection);
  }
  var after = new Date();
  var duration_ms = Math.abs(after - before);

  console.log("INFO: milliseconds to draw", num_primitives, primitive_selection + "s:", duration_ms);
}
