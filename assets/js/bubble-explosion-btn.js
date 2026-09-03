document.querySelectorAll('.button--bubble').forEach((button) => {
  // Find the parent element to scope our searches, just like $(this).parent()
  const parent = button.parentElement;
  
  // Use querySelectorAll and convert to an Array so we can select them by index (0, 1, 2)
  const circlesTopLeft = Array.from(parent.querySelectorAll('.circle.top-left'));
  const circlesBottomRight = Array.from(parent.querySelectorAll('.circle.bottom-right'));
  const effectButton = parent.querySelector('.button.effect-button');

  const tl = new TimelineLite();
  const tl2 = new TimelineLite();
  const btTl = new TimelineLite({ paused: true });

  tl.to(circlesTopLeft, 1.2, { x: -25, y: -25, scaleY: 2, ease: SlowMo.ease.config(0.1, 0.7, false) });
  
  // Replaced .eq(0) with [0]
  if(circlesTopLeft[0]) tl.to(circlesTopLeft[0], 0.1, { scale: 0.2, x: '+=6', y: '-=2' });
  if(circlesTopLeft[1]) tl.to(circlesTopLeft[1], 0.1, { scaleX: 1, scaleY: 0.8, x: '-=10', y: '-=7' }, '-=0.1');
  if(circlesTopLeft[2]) tl.to(circlesTopLeft[2], 0.1, { scale: 0.2, x: '-=15', y: '+=6' }, '-=0.1');
  
  if(circlesTopLeft[0]) tl.to(circlesTopLeft[0], 1, { scale: 0, x: '-=5', y: '-=15', opacity: 0 });
  if(circlesTopLeft[1]) tl.to(circlesTopLeft[1], 1, { scaleX: 0.4, scaleY: 0.4, x: '-=10', y: '-=10', opacity: 0 }, '-=1');
  if(circlesTopLeft[2]) tl.to(circlesTopLeft[2], 1, { scale: 0, x: '-=15', y: '+=5', opacity: 0 }, '-=1');

  const tlBt1 = new TimelineLite();
  const tlBt2 = new TimelineLite();
  
  tlBt1.set(circlesTopLeft, { x: 0, y: 0, rotation: -45 });
  tlBt1.add(tl);

  tl2.set(circlesBottomRight, { x: 0, y: 0 });
  tl2.to(circlesBottomRight, 1.1, { x: 30, y: 30, ease: SlowMo.ease.config(0.1, 0.7, false) });
  
  if(circlesBottomRight[0]) tl2.to(circlesBottomRight[0], 0.1, { scale: 0.2, x: '-=6', y: '+=3' });
  if(circlesBottomRight[1]) tl2.to(circlesBottomRight[1], 0.1, { scale: 0.8, x: '+=7', y: '+=3' }, '-=0.1');
  if(circlesBottomRight[2]) tl2.to(circlesBottomRight[2], 0.1, { scale: 0.2, x: '+=15', y: '-=6' }, '-=0.2');
  
  if(circlesBottomRight[0]) tl2.to(circlesBottomRight[0], 1, { scale: 0, x: '+=5', y: '+=15', opacity: 0 });
  if(circlesBottomRight[1]) tl2.to(circlesBottomRight[1], 1, { scale: 0.4, x: '+=7', y: '+=7', opacity: 0 }, '-=1');
  if(circlesBottomRight[2]) tl2.to(circlesBottomRight[2], 1, { scale: 0, x: '+=15', y: '-=5', opacity: 0 }, '-=1');
  
  tlBt2.set(circlesBottomRight, { x: 0, y: 0, rotation: 45 });
  tlBt2.add(tl2);

  btTl.add(tlBt1);
  if (effectButton) {
    btTl.to(effectButton, 0.8, { scaleY: 1.1 }, 0.1);
  }
  btTl.add(tlBt2, 0.2);
  if (effectButton) {
    btTl.to(effectButton, 1.8, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) }, 1.2);
  }

  btTl.timeScale(2.6);

  // Trigger on hover using native event listener!
  button.addEventListener('mouseover', () => {
    btTl.restart();
  });
});
