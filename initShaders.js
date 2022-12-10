
function initShaders( gl, vertexShaderId, fragmentShaderId ) {
	var vertShdr; //버텍스 쉐이더 선언
	var fragShdr; //프래그먼트 쉐이더 선언

	var vertElem = document.getElementById( vertexShaderId );
	if ( !vertElem ) {
		alert( "Unable to load vertex shader " + vertexShaderId );//버텍스 쉐이더를 불러오지 못하는 상황
		return -1;
	}
	else {
		// 버텍스 쉐이더 소스를 획득하고 그걸 컴파일

		// 버텍스 쉐이더 생성
		vertShdr = gl.createShader(gl.VERTEX_SHADER);

		// 스트링으로 읽기
		gl.shaderSource( vertShdr, vertElem.text );

		// 컴파일 하기
		gl.compileShader( vertShdr );

		// 버텍스 쉐이더 컴파일 실패시 에러로그 출력하기
		if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
			var msg = "Vertex shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
			alert( msg );
			return -1;
		}
	}

	// 프래그먼트 쉐이더 소스를 획득하고 그걸 컴파일
	var fragElem = document.getElementById( fragmentShaderId );
	if ( !fragElem ) {
		alert( "Unable to load vertex shader " + fragmentShaderId );
		return -1;
	}
	else {
		// 프래그먼트 쉐이더 생성
		fragShdr = gl.createShader( gl.FRAGMENT_SHADER );

		// 문자열로 그것을 읽기
		gl.shaderSource( fragShdr, fragElem.text );

		// 컴파일
		gl.compileShader( fragShdr );

		// 프래그먼트 컴파일 실패시 에러 로그 출력
		if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
			var msg = "Fragment shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
			alert( msg );
			return -1;
		}
	}

	// 쉐이더 생성
	var program = gl.createProgram();

	// 쉐이더 2개를 프로그램에 결합
	gl.attachShader( program, vertShdr );
	gl.attachShader( program, fragShdr );

	// 프로그램 링크
	gl.linkProgram( program );

	// 링크 실패시 에러로그 출력
	if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
		var msg = "Shader program failed to link.  The error log is:"
			+ "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
		alert( msg );
		return -1;
	}
	return program;//프로그램 리턴
}
