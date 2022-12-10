WebGLUtils = function() {
	/**
	 * webgl 컨텍스트를 만듬, 생성에 실패하면 <canvas> 태그의 컨테이너 내용이 WebGL에 대한 올바른 링크가 포함된 오류 메시지로 변경됨.
	 * @param {Element} canvas. 컨텍스트를 만들 캔버스 요소
	 * @param {WebGLContextCreationAttirbutes} opt_attribs 전달할 생성 속성.
	 * @return {WebGLRenderingContext} 생성된 컨텍스트.
	 */
	var setupWebGL = function(canvas, opt_attribs) {
		function showLink(str) {
			var container = canvas.parentNode;
			if (container) {
				container.innerHTML = makeFailHTML(str);
			}
		};

		if (!window.WebGLRenderingContext) { // HTML 요소의 그리기 표면에 대한 OpenGL ES 2.0 그래픽 렌더링 컨텍스트에 대한 인터페이스를 제공
			showLink(GET_A_WEBGL_BROWSER);
			return null;
		}

		var context = create3DContext(canvas, opt_attribs);
		if (!context) {
			showLink(OTHER_PROBLEM);
		}
		return context;
	};
	/**
	 * webgl 컨텍스트 생성
	 * @param {!Canvas} canvas 컨텍스트를 가져올 캔버스 태그, 하나가 전달되지 않으면 하나가 생성됨
	 * @return {!WebGLContext} 생성된 컨텍스트
	 */
	var create3DContext = function(canvas, opt_attribs) {
		var names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
		var context = null;
		for (var ii = 0; ii < names.length; ++ii) {
			try {
				context = canvas.getContext(names[ii], opt_attribs);
			}
			catch (e) {}
			if (context) {
				break;
			}
		}
		return context;
	}

	return {
		create3DContext: create3DContext,
		setupWebGL: setupWebGL
	};
}
();
window.requestAnimFrame = (function() {//교차 브라우저 방식으로 request Animation Frame을 제공
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame || //브라우저에게 수행하기를 원하는 애니메이션을 알리고 다음 리페인트가 진행되기 전에 해당 애니메이션을 업데이트하는 함수를 호출하게 함 이 메소드는 리페인트 이전에 실행할 콜백을 인자로 받습니다.
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback, element) {//콜백은 FrameRequestCallback 함수, 엘리먼트는 DOMElement요소
		window.setTimeout(callback, 1000 / 60);
	};
})();


