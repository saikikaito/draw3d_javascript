function createPerspectiveMatrix(fovy,aspect,zNear,zFar){
    let matrix = new Float32Array(16);
    let f = 1.0/Math.tan(fovy/2);

    matrix[0] = f/aspect;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;

    matrix[4] = 0;
    matrix[5] = f;
    matrix[6] = 0;
    matrix[7] = 0;

    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = (zFar + zNear) / (zNear- zFar);
    matrix[11] = -1;

    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = (2 * zFar * zNear) / (zNear - zFar);
    matrix[15] = 0;

    return matrix;
}

function createShaderProgram(gl, vertexSource_id,fragmentSource_id){
    //シェーダー初期化
    let vshader = null;
    let fshader = null;
    let shaderProgram = null;

    //シェーダー用ソースコードの取得
    //頂点シェーダ用ソースコード
    let vsElement = document.getElementById(vertexSource_id);
    if(vsElement == null){
        throw new Error('頂点シェーダ用ソースコードの取得に失敗しました:' + vertexSource_id);
    }

    const vsSource = vsElement.textContent;
    if(vsSource == null){
        throw new Error('頂点シェーダ用ソースコードの取得に失敗しました:' + vertexSource_id);
    }

    //フラグメントシェーダ用ソースコード
    let fsElement = document.getElementById(fragmentSource_id);
    if(fsElement == null){
        throw new Error('フラグメントシェーダ用ソースコードの取得に失敗しました:' + fragmentSource_id);
    }
    const fsSource = fsElement.textContent;
    if(fsSource == null){
        throw new Error('フラグメントシェーダ用ソースコードの取得に失敗しました2:' + fragmentSource_id);
    }

    try{
        //頂点シェーダ
        vshader = gl.createShader(gl.VERTEX_SHADER);
        //ソースコード送信
        gl.shaderSource(vshader,vsSource);
        //コンパイル
        gl.compileShader(vshader);
        //ステータスメソッドで結果取得
        if(gl.getShaderParameter(vshader,gl.COMPILE_STATUS) == false){
            //例外処理
            throw new Error('頂点シェーダ:' + gl.getShaderInfoLog(vshader));
        }

        //フラグメントシェーダ
        fshader = gl.createShader(gl.FRAGMENT_SHADER);
        //ソースコード送信
        gl.shaderSource(fshader,fsSource);
        //コンパイル
        gl.compileShader(fshader);
        //ステータスメソッドで結果取得
        if(gl.getShaderParameter(fshader, gl.COMPILE_STATUS) == false){
            //例外処理
            throw new Error('フラグメントシェーダ:' + gl.getShaderInfoLog(fshader));
        }

        //プログラムシェーダ作成
        shaderProgram = gl.createProgram();
        //プログラムオブジェクトと関連付け
        gl.attachShader(shaderProgram,vshader);
        gl.attachShader(shaderProgram,fshader);
        //リンクで実行可能なプログラムに
        gl.linkProgram(shaderProgram);
        //ステータスメソッドで結果取得
        if(gl.getProgramParameter(shaderProgram,gl.LINK_STATUS) == false){
            //例外処理
            throw new Error('プログラムオブジェクト:' + getProgramInfoLog(shaderProgram));
        }

    }catch(e){
        //shaderProgram作成に失敗した場合は削除
        if(vshader != null) gl.deleteShader(vshader);
        if(fshader != null) gl.deleteShader(fshader);

        //例外を呼び出し元にthrow
        throw(e)
    }
    return shaderProgram;
}