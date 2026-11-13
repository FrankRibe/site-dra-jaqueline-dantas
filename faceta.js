function createVeneerRenderer(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return null;
  const vertex = `
    attribute vec3 position, normal;
    uniform float turn;
    varying vec3 n, local, eye;
    void main() {
      mat3 yaw = mat3(cos(turn),0.,-sin(turn), 0.,1.,0., sin(turn),0.,cos(turn));
      vec3 p = yaw * position;
      n = yaw * normal;
      local = position;
      eye = vec3(0.,0.,5.) - p;
      float perspective = 1.0 - p.z * .15;
      gl_Position = vec4(p.x * .61, p.y * .81, -p.z * .3, perspective);
    }`;
  const fragment = `
    precision mediump float;
    varying vec3 n, local, eye;
    uniform vec3 tone;
    uniform float ceramic;
    float sq(float x) { return x*x; }
    void main() {
      // Fine relief stays on the surface as the light moves across it.
      float ridges = sin(77.0*local.y + 3.0*sin(4.0*local.x));
      vec3 N = normalize(n + vec3(0., ridges*mix(.011,.005,ceramic), 0.));
      vec3 V = normalize(eye);
      vec3 R = reflect(-V,N);
      float diffuse = max(0.,dot(N,normalize(vec3(-.64,.40,.65))));
      float grazing = pow(1.-abs(dot(N,V)), 2.5);
      float scallop = .065*cos(13.*local.x + .4);
      float incisal = 1.-smoothstep(-.96,-.57,local.y + scallop);
      float cervical = smoothstep(.32,.98,local.y);
      vec3 enamel = tone + cervical*vec3(.003,-.002,-.012);
      vec3 body = enamel*(.63 + .34*diffuse + .04*max(N.y,0.));
      body = mix(body, tone*vec3(.79,.82,.85), incisal*mix(.27,.43,ceramic));
      float broad = exp(-9.*sq(R.x+.53)-2.*sq(R.y-.26));
      float strip = exp(-mix(68.,145.,ceramic)*sq(R.x-.38)-4.*sq(R.y+.19));
      float gloss = broad*.16 + strip*mix(.20,.30,ceramic) + grazing*.15;
      gl_FragColor = vec4(mix(body,vec3(1.),clamp(gloss,0.,.8)),1.);
    }`;
  const program = gl.createProgram();
  for (const [type, source] of [[gl.VERTEX_SHADER,vertex],[gl.FRAGMENT_SHADER,fragment]]) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader,source);
    gl.compileShader(shader);
    gl.attachShader(program,shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program,gl.LINK_STATUS)) {
    console.warn("Renderização da faceta indisponível", gl.getProgramInfoLog(program));
    return null;
  }
  gl.useProgram(program);

  function point(t, r, back) {
    const c = Math.cos(t), s = Math.sin(t);
    const y = r * Math.sign(s) * Math.pow(Math.abs(s), s < 0 ? .43 : .88);
    const width = .78 - .085*y;
    const x = r * Math.sign(c) * Math.pow(Math.abs(c),.60) * width;
    const facialRidges = .023*Math.cos(10*x+.65*y)*Math.exp(-1.7*y*y);
    const crown = .31-.64*x*x-.19*y*y + facialRidges;
    const thickness = .038+.092*(1-r*r);
    const incisalEdge = Math.max(0,-y)**4;
    const contour = y + incisalEdge*(.022*Math.cos(12*x)+.035*x);
    return [x+.032*y*y, contour, crown-(back ? thickness : 0)];
  }
  const positions = [], normals = [];
  function add(t,r,back,wall) {
    const p = point(t,r,back);
    const a = point(t+.001,r,back), b = point(t,r+.001,back);
    const u = a.map((v,i)=>v-p[i]), v = b.map((w,i)=>w-p[i]);
    const n = wall ? [Math.cos(t),Math.sin(t),0] :
      [u[2]*v[1]-u[1]*v[2],u[0]*v[2]-u[2]*v[0],u[1]*v[0]-u[0]*v[1]];
    const length = Math.hypot(...n) || 1;
    positions.push(...p);
    normals.push(...n.map(value=>value/length*(back && !wall ? -1 : 1)));
  }
  const sectors=80, rings=20;
  for (let i=0;i<sectors;i++) {
    const t=i*2*Math.PI/sectors, t1=(i+1)*2*Math.PI/sectors;
    for (let j=0;j<rings;j++) {
      const r=Math.max(.0001,j/rings), r1=(j+1)/rings;
      for (const back of [false,true]) {
        for (const [a,b] of [[t,r],[t1,r],[t1,r1],[t,r],[t1,r1],[t,r1]]) add(a,b,back,false);
      }
    }
    for (const [a,b] of [[t,false],[t1,false],[t1,true],[t,false],[t1,true],[t,true]]) add(a,1,b,true);
  }
  for (const [name,data] of [['position',positions],['normal',normals]]) {
    gl.bindBuffer(gl.ARRAY_BUFFER,gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(data),gl.STATIC_DRAW);
    const attribute=gl.getAttribLocation(program,name);
    gl.enableVertexAttribArray(attribute);
    gl.vertexAttribPointer(attribute,3,gl.FLOAT,false,0,0);
  }
  gl.enable(gl.DEPTH_TEST);
  const turn=gl.getUniformLocation(program,'turn'), tint=gl.getUniformLocation(program,'tone');
  gl.uniform1f(gl.getUniformLocation(program,'ceramic'),Number(canvas.id==='porcelain-model'));
  return (angle,color) => {
    gl.viewport(0,0,canvas.width,canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(turn,angle*Math.PI/180);
    gl.uniform3fv(tint,color.map(value=>value/255));
    gl.drawArrays(gl.TRIANGLES,0,positions.length/3);
  };
}
