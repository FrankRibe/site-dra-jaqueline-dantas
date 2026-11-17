(() => {
  const form = document.querySelector('.directions-form');
  if (!form) return;

  // Sem origem explícita, o Maps oferece a localização disponível no dispositivo.
  // A página da clínica não solicita, armazena nem calcula coordenadas do visitante.
  form.addEventListener('formdata', event => {
    const origin = String(event.formData.get('origin') || '').trim();
    if (origin) event.formData.set('origin', origin);
    else event.formData.delete('origin');
  });

  const uberOption = form.querySelector('[data-uber-option]');
  const uberLink = form.querySelector('[data-uber-link]');
  const ride99Option = form.querySelector('[data-99-option]');
  const ride99Panel = form.querySelector('[data-99-panel]');
  const ride99Link = form.querySelector('[data-99-link]');
  const mapsOrigin = form.querySelector('[data-maps-origin]');
  const mapsSubmit = form.querySelector('button[type="submit"]');
  const routeNote = form.querySelector('.route-note');
  if (uberOption && uberLink && ride99Option && ride99Panel && ride99Link && mapsOrigin && mapsSubmit && routeNote) {
    const mapsNote = routeNote.textContent;
    const updateTravelMode = () => {
      const isUber = form.elements.travelmode.value === 'uber';
      const is99 = form.elements.travelmode.value === '99';
      const isRideApp = isUber || is99;
      mapsOrigin.hidden = isRideApp;
      form.elements.origin.disabled = isRideApp;
      mapsSubmit.hidden = isRideApp;
      ride99Panel.hidden = !is99;
      uberLink.hidden = !isUber;
      routeNote.textContent = isUber
        ? 'A Uber usará sua localização, se permitida. Confira ou ajuste o embarque, veja preço e previsão de chegada e confirme a corrida na Uber. A abertura do aplicativo depende do dispositivo.'
        : is99
          ? 'O destino não é preenchido automaticamente. Na 99, informe o endereço, confirme seu local de partida e consulte preço e tempo. O link oficial pode abrir a loja de aplicativos.'
          : mapsNote;
    };
    uberOption.hidden = false;
    ride99Option.hidden = false;
    form.querySelector('.travel-options').classList.add('has-ride-apps');
    form.addEventListener('change', updateTravelMode);
    // Evita enviar modos de aplicativos ao Maps por envio implícito do formulário.
    form.addEventListener('submit', event => {
      const mode = form.elements.travelmode.value;
      if (mode === 'uber' || mode === '99') {
        event.preventDefault();
        (mode === 'uber' ? uberLink : ride99Link).click();
      }
    });
    window.addEventListener('pageshow', updateTravelMode);
    updateTravelMode();
  }

  const copies = document.querySelectorAll('[data-copy-address]');
  if (!navigator.clipboard?.writeText) return;
  copies.forEach(copy => {
    const status = copy.parentElement.querySelector('[data-copy-status]');
    if (!status) return;
    copy.hidden = false;
    copy.addEventListener('click', async () => {
      copy.disabled = true;
      status.textContent = '';
      try {
        await navigator.clipboard.writeText(form.elements.destination.value);
        status.textContent = copy.closest('[data-99-panel]')
          ? 'Endereço copiado. Agora acesse a 99 e cole no destino.'
          : 'Endereço copiado.';
      } catch {
        status.textContent = 'Não foi possível copiar. Selecione o endereço acima e copie manualmente.';
      } finally {
        copy.disabled = false;
      }
    });
  });
})();
