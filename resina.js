for (const demo of document.querySelectorAll('.resin-demo:has([data-tone])')) {
  // Superfície curva e espessura de uma faceta ilustrativa, em coordenadas 3D.
  const model = demo.querySelector('canvas');
  const angle = demo.querySelector('input[type=range]');
  const realistic = createVeneerRenderer(model);
  const context = realistic ? null : model.getContext('2d');
  let tone = demo.querySelector('[data-tone][aria-pressed=true]').dataset.tone.split(',').map(Number);
  for (const button of demo.querySelectorAll('[data-tone]')) {
    button.style.setProperty('--swatch', 'rgb(' + button.dataset.tone + ')');
  }

  function surface(u, v, back) {
    const cosine = Math.cos(u);
    const sine = Math.sin(u);
    const outline = Math.sign(cosine) * Math.pow(Math.abs(cosine), 0.57);
    const height = Math.sign(sine) * Math.pow(Math.abs(sine), 0.72);
    const x = v * outline * (0.78 - height * 0.11);
    const y = v * height * 1.08;
    const z = 0.36 * (1 - x * x * 1.6) - 0.11 * y * y - (back ? 0.084 : 0);
    return [x, y, z];
  }

  function drawResin() {
    if (realistic) return realistic(Number(angle.value), tone);
    if (!context) return;
    const radians = Number(angle.value) * Math.PI / 180;
    const cos = Math.cos(radians), sin = Math.sin(radians);
    const faces = [];
    function face(points, edge = false) {
      const rotated = points.map(([x,y,z]) => [x*cos + z*sin, y, z*cos - x*sin]);
      const [a,b,c] = rotated;
      const ab = b.map((n,i) => n-a[i]), ac = c.map((n,i) => n-a[i]);
      const nx = ab[1]*ac[2]-ab[2]*ac[1];
      const ny = ab[2]*ac[0]-ab[0]*ac[2];
      const nz = ab[0]*ac[1]-ab[1]*ac[0];
      const length = Math.hypot(nx,ny,nz) || 1;
      const light = Math.abs((-0.48*nx-0.38*ny+0.79*nz)/length);
      const shade = edge ? 0.69 : 0.71 + 0.29*light;
      faces.push({points:rotated, depth:rotated.reduce((s,p)=>s+p[2],0)/rotated.length,
        color:'rgb('+tone.map(n=>Math.round(n*shade)).join(',')+')'});
    }
    for (let i=0;i<64;i++) {
      const a=i*Math.PI/32, b=(i+1)*Math.PI/32;
      for(let j=0;j<12;j++) {
        for(const back of [true,false]) {
          const inner=j/12, outer=(j+1)/12;
          face([surface(a,outer,back),surface(b,outer,back),surface(b,inner,back),surface(a,inner,back)]);
        }
      }
      face([surface(a,1,false),surface(b,1,false),surface(b,1,true),surface(a,1,true)],true);
    }
    context.clearRect(0,0,560,420);
    faces.sort((a,b)=>a.depth-b.depth);
    for(const f of faces) {
      context.beginPath();
      for(const [i,[x,y,z]] of f.points.entries()) {
        const scale=150/(1-z*0.09);
        const px=280+x*scale, py=207-y*scale;
        if(i===0) context.moveTo(px,py); else context.lineTo(px,py);
      }
      context.closePath();
      context.fillStyle=context.strokeStyle=f.color;
      context.lineWidth=0.7;
      context.fill(); context.stroke();
    }
  }

  const smile = demo.querySelector('.full-smile');
  const caption = demo.querySelector('.smile-caption');
  function updateSmile() {
    if (smile.hidden) return;
    const porcelain = model.id === 'porcelain-model';
    drawIllustratedSmile(smile, tone, porcelain);
    const code = demo.querySelector('[data-tone][aria-pressed=true]').textContent;
    caption.textContent = 'Sorriso ilustrativo · ' + (porcelain ? 'Porcelana' : 'Resina') + ' · ' + code;
  }
  for (const button of demo.querySelectorAll('[data-view]')) {
    button.onclick = () => {
      const showSmile = button.dataset.view === 'smile';
      smile.hidden = caption.hidden = !showSmile;
      model.hidden = angle.parentElement.hidden = showSmile;
      for (const choice of button.parentElement.children) choice.setAttribute('aria-pressed', String(choice === button));
      updateSmile();
      if (!showSmile) scheduleDraw();
    };
  }
  let frame;
  function scheduleDraw() {
    cancelAnimationFrame(frame);
    frame=requestAnimationFrame(drawResin);
  }
  angle.addEventListener('input',scheduleDraw);
  demo.querySelectorAll('[data-tone]').forEach(button => button.addEventListener('click',()=>{
    tone=button.dataset.tone.split(',').map(Number);
    for(const item of demo.querySelectorAll('[data-tone]')) item.setAttribute('aria-pressed',String(item===button));
    updateSmile();
    scheduleDraw();
  }));
  let startX, startAngle;
  model.addEventListener('pointerdown',event=>{
    model.setPointerCapture(event.pointerId);
    startX=event.clientX; startAngle=Number(angle.value);
  });
  model.addEventListener('pointermove',event=>{
    if(!model.hasPointerCapture(event.pointerId)) return;
    angle.value=String(startAngle+(event.clientX-startX)*0.7);
    scheduleDraw();
  });
  drawResin();
}

const whiteningPhoto = document.querySelector('#whitening-photo');
const whiteningButtons = document.querySelectorAll('[data-whitening]');
for (const button of whiteningButtons) {
  button.onclick = () => {
    whiteningPhoto.src = 'assets/galeria/' + button.dataset.whitening + '.jpg';
    whiteningPhoto.alt = 'Registro de clareamento publicado pela Dra. Jaqueline, ' + button.textContent;
    for (const item of whiteningButtons) item.setAttribute('aria-pressed', String(item === button));
  };
}
