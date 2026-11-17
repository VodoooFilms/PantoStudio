'use strict';

// Upscale tab — Panto Upscaler's Lanczos workflow.
(function () {
  const COPY = {
    es: {
      selectAria: 'Seleccionar vídeos',
      dropTitle: 'Arrastra vídeos',
      dropHint: 'o haz clic para abrir',
      scaleBatch: (count, label) => `Escalar ${count} vídeos a ${label}`,
      queue: 'Cola',
      queueCount: (done, total) => `${done}/${total} listos`,
      fileStates: { pending: 'En espera', processing: 'Escalando…', done: 'Listo', error: 'Error' },
      removeFile: 'Quitar de la cola',
      batchFailed: (count) => `${count} con error`,
      input: 'Entrada',
      output: 'Salida',
      noFile: 'Sin archivo',
      targetsAria: 'Resolución de salida',
      modesAria: 'Ajuste de imagen',
      modes: { pad: 'Barras negras', crop: 'Recortar', stretch: 'Estirar' },
      scaleTo: (label) => `Escalar a ${label}`,
      ready: 'Lanczos',
      readyDetail: 'Calidad máxima · CRF 14',
      scanning: 'Analizando vídeo…',
      scanningDetail: 'Leyendo pistas y metadatos',
      scaling: 'Escalando…',
      scalingDetail: 'Lanczos · precisión de color completa',
      done: 'Listo',
      error: 'Error',
      larger: 'más grande',
      smaller: 'más pequeño',
      similar: 'similar',
      estimate: 'aprox.',
      cancel: 'Cancelar',
      another: 'Escalar otro',
      reveal: 'Mostrar en Finder',
      remove: 'Quitar vídeo',
      folder: 'Elegir carpeta de salida',
      engineTitle: 'Escalador Lanczos de FFmpeg',
      ffmpegMissing: 'No se encontró FFmpeg. Instálalo con "brew install ffmpeg".',
      unsupported: 'Ese archivo no es un vídeo compatible.',
      busy: 'Ya hay una conversión en curso.',
      timeout: 'FFmpeg tardó demasiado. Prueba con un archivo más pequeño.',
      failed: 'No se pudo completar el escalado.',
      models: 'Modelos',
      modelsSubtitle: 'Elige el motor de escalado o libera espacio',
      modelsFoot: 'Los motores de IA ya vienen con la app (1,2 MB). Real-ESRGAN está hecho para animación y video; Lanczos es instantáneo pero solo redimensiona.',
      modelActive: 'Activo',
      modelReady: 'Listo',
      useModel: 'Usar este modelo',
      close: 'Cerrar',
      aiDetail: 'IA · modelos incluidos en la app',
      scalingAi: 'Escalando con IA…',
      etaConfirm: (eta) => `El escalado con IA tomaría aproximadamente ${eta} en este clip. ¿Continuar? Lanczos da el mismo resultado en segundos.`,
      etaRemaining: 'restante',
      scalingAiDetail: 'Real-ESRGAN · muy rápido · audio conservado',
      modelMissingErr: 'El motor de IA no está disponible.',
      sdMissing: 'No se encontró el motor de IA en la app.',
      sdFailed: 'El motor de IA falló.'
    },
    en: {
      selectAria: 'Select videos',
      dropTitle: 'Drop videos',
      dropHint: 'or click to browse',
      scaleBatch: (count, label) => `Upscale ${count} videos to ${label}`,
      queue: 'Queue',
      queueCount: (done, total) => `${done}/${total} done`,
      fileStates: { pending: 'Pending', processing: 'Upscaling…', done: 'Done', error: 'Error' },
      removeFile: 'Remove from queue',
      batchFailed: (count) => `${count} failed`,
      formats: 'MP4 · MOV · MKV · WEBM · AVI',
      input: 'Input',
      output: 'Output',
      noFile: 'No file',
      targetsAria: 'Output resolution',
      modesAria: 'Image fit',
      modes: { pad: 'Black bars', crop: 'Crop', stretch: 'Stretch' },
      scaleTo: (label) => `Upscale to ${label}`,
      ready: 'Lanczos',
      readyDetail: 'Maximum quality · CRF 14',
      scanning: 'Analyzing video…',
      scanningDetail: 'Reading tracks and metadata',
      scaling: 'Upscaling…',
      scalingDetail: 'Lanczos · full chroma precision',
      done: 'Done',
      error: 'Error',
      larger: 'larger',
      smaller: 'smaller',
      similar: 'similar',
      estimate: 'approx.',
      cancel: 'Cancel',
      another: 'Upscale another',
      reveal: 'Show in Finder',
      remove: 'Remove video',
      folder: 'Choose output folder',
      engineTitle: 'FFmpeg Lanczos scaler',
      ffmpegMissing: 'FFmpeg was not found. Install it with "brew install ffmpeg".',
      unsupported: 'That file is not a supported video.',
      busy: 'A conversion is already in progress.',
      timeout: 'FFmpeg took too long. Try a smaller file.',
      failed: 'The upscale could not be completed.',
      quality: 'H.264 · CRF 14',
      models: 'Models',
      modelsSubtitle: 'Choose the upscale engine or free up space',
      modelsFoot: 'AI engines ship inside the app (1.2 MB). Real-ESRGAN is made for animation and video; Lanczos is instant but only resizes.',
      modelActive: 'Active',
      modelReady: 'Ready',
      useModel: 'Use this model',
      close: 'Close',
      aiDetail: 'AI · models built into the app',
      scalingAi: 'AI upscaling…',
      etaConfirm: (eta) => `AI upscaling would take roughly ${eta} on this clip. Continue? Lanczos gets the same result in seconds.`,
      etaRemaining: 'remaining',
      scalingAiDetail: 'Real-ESRGAN · very fast · audio preserved',
      modelMissingErr: 'The AI engine is not available.',
      sdMissing: 'The AI engine was not found in the app.',
      sdFailed: 'The AI engine failed.'
    }
  };

  const TARGETS = {
    720: { width: 1280, height: 720, label: '720p' },
    1080: { width: 1920, height: 1080, label: '1080p' },
    1440: { width: 2560, height: 1440, label: '1440p' },
    2160: { width: 3840, height: 2160, label: '4K' }
  };

  const $ = (id) => document.getElementById(id);
  const tab = $('tab-upscale');
  const inputCard = $('upInputCard');
  const inputThumb = $('upInputThumb');
  const inputEmpty = $('upInputEmpty');
  const inputBadge = $('upInputBadge');
  const removeButton = $('upRemoveButton');
  const outputThumb = $('upOutputThumb');
  const outputEmpty = $('upOutputEmpty');
  const outputBadge = $('upOutputBadge');
  const folderButton = $('upFolderButton');
  const targetGroup = $('upTargetGroup');
  const modeGroup = $('upModeGroup');
  const convertButton = $('upConvertButton');
  const cancelButton = $('upCancelButton');
  const anotherButton = $('upAnotherButton');
  const revealButton = $('upRevealButton');
  const statusPanel = $('upStatusPanel');
  const statusIcon = $('upStatusIcon');
  const statusTitle = $('upStatusTitle');
  const statusDetail = $('upStatusDetail');
  const statusRight = $('upStatusRight');
  const progressTrack = $('upProgressTrack');
  const progressBar = $('upProgressBar');
  const queuePanel = $('upQueue');
  const queueList = $('upQueueList');
  const queueCount = $('upQueueCount');

  const state = {
    language: 'es',
    file: null,
    files: [],
    fileStatus: {},
    plan: null,
    target: '1080',
    mode: 'crop',
    outputDirectory: null,
    converting: false,
    loading: false,
    cancelRequested: false,
    result: null,
    results: [],
    activeIndex: 0,
    finishedCount: 0,
    planRequest: 0,
    ffmpegAvailable: true,
    engine: 'lanczos',
    models: []
  };

  function pendingFiles() {
    return state.files.filter((file) => state.fileStatus[file.path] !== 'done');
  }

  function doneCount() {
    return state.files.filter((file) => state.fileStatus[file.path] === 'done').length;
  }

  function clearResults() {
    state.result = null;
    state.results = [];
    state.finishedCount = 0;
    state.activeIndex = 0;
    for (const file of state.files) state.fileStatus[file.path] = 'pending';
    tab.classList.remove('is-complete');
  }

  function formatEta(seconds) {
    const total = Math.max(0, Math.round(seconds));
    if (total < 90) return `≈ ${total} s`;
    const minutes = Math.round(total / 60);
    if (minutes < 90) return `≈ ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const rest = minutes % 60;
    return rest ? `≈ ${hours} h ${rest} min` : `≈ ${hours} h`;
  }

  // Measured on M4: ~0.3 s/frame (x2) and ~0.8 s/frame (x4) on 832x480;
  // GPU-bound, so it grows near-linearly with pixel count.
  function aiSecondsPerFrame(width, height, factor) {
    const pixels = Math.max(1, (width * height) / (832 * 480));
    const base = factor >= 4 ? 0.8 : 0.35;
    return base * Math.max(0.5, Math.min(pixels, 20));
  }

  function aiEtaSecondsFor(file) {
    if (!file) return 0;
    const fps = file.fps > 0 ? file.fps : 30;
    const frames = Math.max(1, Math.round(file.duration * fps));
    const factor = state.engine === 'esr-x4' ? 4 : 2;
    return frames * aiSecondsPerFrame(file.width, file.height, factor);
  }

  function aiEtaSeconds() {
    return pendingFiles().reduce((total, file) => total + aiEtaSecondsFor(file), 0);
  }

  function isAi() {
    return state.engine !== 'lanczos';
  }

  function activeModelInfo() {
    return state.models.find((model) => model.id === state.engine) || null;
  }

  function engineReady() {
    if (!isAi()) return true;
    const model = activeModelInfo();
    return Boolean(model && model.downloaded);
  }

  const copy = () => COPY[state.language];
  const t = (key) => copy()[key];

  function formatBytes(bytes) {
    if (!Number.isFinite(bytes) || bytes <= 0) return '0 MB';
    if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(2)} GB`;
    const megabytes = bytes / 1024 ** 2;
    return `${megabytes < 1 ? megabytes.toFixed(2) : megabytes.toFixed(1)} MB`;
  }



  function fileStem(name) {
    return name.replace(/\.[^.]+$/, '');
  }

  function sizeDelta(result) {
    if (!result || !result.inputBytes || !result.outputBytes) return '';
    const ratio = result.outputBytes / result.inputBytes;
    if (ratio >= 1.05) return `+${Math.round((ratio - 1) * 100)}% ${t('larger')}`;
    if (ratio <= 0.95) return `−${Math.round((1 - ratio) * 100)}% ${t('smaller')}`;
    return t('similar');
  }

  function targetInfo() {
    return TARGETS[state.target] || TARGETS['1080'];
  }

  function setStatusIdle() {
    statusPanel.className = 'status idle';
    statusIcon.textContent = '';
    if (isAi()) {
      const model = activeModelInfo();
      statusTitle.textContent = model ? model.name : 'Real-ESRGAN';
      statusDetail.textContent = t('aiDetail');
    } else {
      statusTitle.textContent = t('ready');
      statusDetail.textContent = t('readyDetail');
    }
    statusRight.textContent = state.plan ? `≈ ${formatBytes(state.plan.estimatedBytes)}` : '';
    progressTrack.classList.add('hidden');
  }

  function setStatusLoading() {
    statusPanel.className = 'status processing';
    statusIcon.textContent = '';
    statusTitle.textContent = t('scanning');
    statusDetail.textContent = t('scanningDetail');
    statusRight.textContent = '';
    progressTrack.classList.add('hidden');
  }

  function setStatusProcessing(percent) {
    statusPanel.className = 'status processing';
    statusIcon.textContent = '';
    statusTitle.textContent = isAi() ? t('scalingAi') : t('scaling');
    const detail = isAi()
      ? t('scalingAiDetail')
      : state.plan ? `${state.plan.label} · ${t('scalingDetail')}` : t('scalingDetail');
    const active = state.files[state.activeIndex];
    statusDetail.textContent = state.files.length > 1 && active
      ? `${state.activeIndex + 1}/${state.files.length} · ${active.name} · ${detail}`
      : detail;
    statusRight.textContent = `${Math.round(percent)}%`;
    progressTrack.classList.remove('hidden');
    progressBar.style.width = `${Math.max(0, Math.min(100, percent))}%`;
  }

  function setStatusBatchSuccess(failedCount) {
    const results = state.results;
    const last = results[results.length - 1];
    statusPanel.className = 'status success';
    statusIcon.textContent = '✓';
    statusTitle.textContent = t('done');
    const totalBytes = results.reduce((total, result) => total + result.outputBytes, 0);
    statusDetail.textContent = `${t('queueCount')(doneCount(), state.files.length)} · ${formatBytes(totalBytes)}`
      + (failedCount ? ` · ${t('batchFailed')(failedCount)}` : '');
    statusRight.textContent = last ? sizeDelta(last) : '';
    progressTrack.classList.add('hidden');
  }

  function setStatusSuccess(result) {
    statusPanel.className = 'status success';
    statusIcon.textContent = '✓';
    statusTitle.textContent = t('done');
    statusDetail.textContent = `${result.plan.targetWidth} × ${result.plan.targetHeight} · ${formatBytes(result.outputBytes)}`;
    statusRight.textContent = sizeDelta(result);
    progressTrack.classList.add('hidden');
  }

  function setStatusError(message) {
    statusPanel.className = 'status error';
    statusIcon.textContent = '!';
    statusTitle.textContent = t('error');
    statusDetail.textContent = message;
    statusRight.textContent = '';
    progressTrack.classList.add('hidden');
  }

  function renderInput() {
    const file = state.file;
    const hasThumb = Boolean(file && file.thumbnail);

    inputEmpty.classList.toggle('hidden', Boolean(file));
    inputThumb.classList.toggle('hidden', !hasThumb);
    inputBadge.classList.toggle('hidden', !(hasThumb && file && file.width));
    removeButton.classList.toggle('hidden', !file);

    inputCard.setAttribute('aria-label', file ? `${file.name}, ${file.width} × ${file.height}` : t('selectAria'));

    if (file) {
      if (hasThumb) inputThumb.src = file.thumbnail;
      else inputThumb.removeAttribute('src');

      $('upInputName').textContent = state.files.length > 1
        ? `${file.name}  +${state.files.length - 1}`
        : file.name;
      $('upInputDimensions').textContent = file.width ? `${file.width} × ${file.height}` : '—';
      inputBadge.textContent = `${file.width} × ${file.height}`;
    } else {
      inputThumb.removeAttribute('src');
      $('upInputName').textContent = t('noFile');
      $('upInputDimensions').textContent = '—';
      inputBadge.textContent = '';
    }
  }

  function renderQueue() {
    const show = state.files.length > 1;
    queuePanel.classList.toggle('hidden', !show);
    if (!show) return;
    $('upQueueTitle').textContent = t('queue');
    queueCount.textContent = t('queueCount')(doneCount(), state.files.length);
    queueList.textContent = '';
    state.files.forEach((file, index) => {
      const status = state.fileStatus[file.path] || 'pending';
      const row = document.createElement('div');
      row.className = `up-queue-row${state.converting && index === state.activeIndex ? ' is-active' : ''}`;

      const name = document.createElement('span');
      name.className = 'up-queue-name';
      name.textContent = file.name;
      name.title = file.path;

      const dims = document.createElement('span');
      dims.className = 'up-queue-dims';
      dims.textContent = file.width ? `${file.width} × ${file.height}` : '—';

      const stateLabel = document.createElement('span');
      stateLabel.className = `up-queue-state ${status}`;
      stateLabel.textContent = t('fileStates')[status] || status;

      const remove = document.createElement('button');
      remove.className = 'up-queue-remove';
      remove.textContent = '×';
      remove.title = t('removeFile');
      remove.setAttribute('aria-label', `${t('removeFile')}: ${file.name}`);
      remove.disabled = state.converting;
      remove.addEventListener('click', (event) => {
        event.stopPropagation();
        removeQueuedFile(file.path);
      });

      row.append(name, dims, stateLabel, remove);
      queueList.append(row);
    });
  }

  function renderOutput() {
    const plan = state.plan;
    const result = state.result;

    if (result) {
      outputEmpty.classList.add('hidden');
      outputThumb.classList.remove('hidden');
      outputBadge.classList.remove('hidden');
      outputThumb.src = result.thumbnail || (state.file && state.file.thumbnail) || '';
      outputBadge.textContent = `${result.plan.targetWidth} × ${result.plan.targetHeight}`;
      $('upOutputName').textContent = state.results.length > 1
        ? `${result.outputName}  +${state.results.length - 1}`
        : result.outputName;
      $('upOutputDimensions').textContent = `${result.plan.targetWidth} × ${result.plan.targetHeight}`;
      return;
    }

    if (state.file && plan) {
      outputEmpty.classList.add('hidden');
      outputBadge.classList.add('hidden');
      outputThumb.classList.toggle('hidden', !state.file.thumbnail);
      if (state.file.thumbnail) outputThumb.src = state.file.thumbnail;
      else outputThumb.removeAttribute('src');

      $('upOutputName').textContent = `${fileStem(state.file.name)}_${plan.label.toLowerCase()}.mp4`;
      $('upOutputDimensions').textContent = `${plan.targetWidth} × ${plan.targetHeight}`;
      return;
    }

    const target = targetInfo();
    outputThumb.classList.add('hidden');
    outputThumb.removeAttribute('src');
    outputBadge.classList.add('hidden');
    outputEmpty.classList.remove('hidden');
    $('upOutputTargetChip').textContent = target.label;
    $('upOutputTargetDims').textContent = `${target.width} × ${target.height}`;
    $('upOutputName').textContent = '—';
    $('upOutputDimensions').textContent = '—';
  }

  function renderActions() {
    const pending = pendingFiles().length;
    const showConvert = !state.converting && pending > 0;
    const showCancel = state.converting;
    const showResult = !state.converting && Boolean(state.result);

    convertButton.classList.toggle('hidden', !showConvert);
    cancelButton.classList.toggle('hidden', !showCancel);
    anotherButton.classList.toggle('hidden', !showResult);
    revealButton.classList.toggle('hidden', !showResult);

    convertButton.disabled = !state.file || state.loading || !state.ffmpegAvailable || !engineReady();
    const label = (state.plan && state.plan.label) || targetInfo().label;
    convertButton.textContent = pending > 1 ? t('scaleBatch')(pending, label) : t('scaleTo')(label);
    cancelButton.textContent = t('cancel');
    anotherButton.textContent = t('another');
    revealButton.textContent = t('reveal');
  }

  function renderTargetSelection() {
    for (const button of targetGroup.querySelectorAll('[data-target]')) {
      const active = button.dataset.target === state.target;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    for (const button of modeGroup.querySelectorAll('[data-mode]')) {
      const active = button.dataset.mode === state.mode;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', active ? 'true' : 'false');
    }
  }

  function renderFolderButton() {
    const custom = Boolean(state.outputDirectory);
    folderButton.classList.toggle('custom', custom);
    folderButton.title = custom ? state.outputDirectory : t('folder');
    folderButton.setAttribute('aria-label', t('folder'));
  }

  async function refreshPlan() {
    if (!state.file) {
      state.plan = null;
      renderOutput();
      if (!state.converting && !state.result) setStatusIdle();
      renderActions();
      return;
    }

    const request = ++state.planRequest;
    try {
      const plan = await window.pantoUpscale.computePlan({
        width: state.file.width,
        height: state.file.height,
        duration: state.file.duration,
        audioKbps: state.file.audioKbps || 0,
        target: state.target,
        mode: state.mode
      });
      if (request !== state.planRequest) return;
      state.plan = plan;
      renderOutput();
      if (!state.converting && !state.result) setStatusIdle();
      renderActions();
    } catch (error) {
      if (request !== state.planRequest) return;
      handleError(error);
    }
  }

  function setFiles(files, append = false) {
    const incoming = (files || []).filter(Boolean);
    if (!incoming.length) return;
    if (append && state.files.length && !state.result) {
      const known = new Set(state.files.map((file) => file.path));
      for (const file of incoming) {
        if (!known.has(file.path)) {
          state.files.push(file);
          state.fileStatus[file.path] = 'pending';
        }
      }
    } else {
      state.files = incoming;
      state.fileStatus = {};
      for (const file of incoming) state.fileStatus[file.path] = 'pending';
      clearResults();
    }
    state.file = state.files[0] || null;
    state.loading = false;
    state.cancelRequested = false;
    tab.classList.remove('is-processing', 'is-complete');
    renderInput();
    renderQueue();
    renderOutput();
    renderActions();
    refreshPlan();
  }

  function setFile(file) {
    setFiles([file]);
  }

  function removeQueuedFile(path) {
    if (state.converting) return;
    state.files = state.files.filter((file) => file.path !== path);
    delete state.fileStatus[path];
    state.results = state.results.filter((result) => result.inputPath !== path);
    if (!state.files.length) {
      resetFile();
      return;
    }
    if (state.file && state.file.path === path) state.file = state.files[0];
    if (state.result && !state.results.length) state.result = null;
    else if (state.results.length) state.result = state.results[state.results.length - 1];
    renderInput();
    renderQueue();
    renderOutput();
    renderActions();
    refreshPlan();
  }

  function resetFile() {
    if (state.converting) return;
    state.file = null;
    state.files = [];
    state.fileStatus = {};
    state.plan = null;
    state.result = null;
    state.results = [];
    state.finishedCount = 0;
    state.activeIndex = 0;
    state.loading = false;
    state.planRequest += 1;
    tab.classList.remove('is-processing', 'is-complete');
    renderInput();
    renderQueue();
    renderOutput();
    renderActions();
    setStatusIdle();
  }

  async function chooseFile() {
    if (state.converting || state.loading) return;
    state.loading = true;
    renderActions();
    setStatusLoading();
    try {
      const files = await window.pantoUpscale.selectVideos();
      if (!files || !files.length) {
        state.loading = false;
        renderActions();
        if (state.result) setStatusSuccess(state.result);
        else setStatusIdle();
        return;
      }
      setFiles(files);
    } catch (error) {
      state.loading = false;
      handleError(error);
    }
  }

  async function handleDrop(paths) {
    if (!paths || !paths.length || state.converting) return;
    state.loading = true;
    renderActions();
    setStatusLoading();
    try {
      const files = await window.pantoUpscale.inspectVideos(paths);
      state.loading = false;
      if (!files || !files.length) {
        handleError(new Error('UNSUPPORTED'));
        return;
      }
      // Drops build the queue: they append to a pending batch (deduped by
      // path) and replace it once the previous batch is done.
      setFiles(files, state.files.length > 0 && !state.result);
    } catch (error) {
      state.loading = false;
      handleError(error);
    }
  }

  async function chooseOutputFolder() {
    if (state.converting) return;
    try {
      const folder = await window.pantoUpscale.chooseFolder();
      if (!folder) return;
      state.outputDirectory = folder;
      renderFolderButton();
    } catch (error) {
      handleError(error);
    }
  }

  function errorMessageFor(error) {
    const raw = typeof error === 'string' ? error : (error && error.message) || '';
    if (raw.startsWith('FFMPEG_MISSING')) return t('ffmpegMissing');
    if (raw.startsWith('MODEL_MISSING')) return t('modelMissingErr');
    if (raw.startsWith('SD_MISSING')) return t('sdMissing');
    if (raw.startsWith('SD_FAILED:')) return raw.slice('SD_FAILED:'.length).trim() || t('sdFailed');
    if (raw.startsWith('UNSUPPORTED')) return t('unsupported');
    if (raw.startsWith('BUSY')) return t('busy');
    if (raw.startsWith('FFMPEG_TIMEOUT')) return t('timeout');
    if (raw.startsWith('FFMPEG_FAILED:')) return raw.slice('FFMPEG_FAILED:'.length).trim() || t('failed');
    return raw || t('failed');
  }

  function handleError(error) {
    state.loading = false;
    state.converting = false;
    tab.classList.remove('is-processing');
    setStatusError(errorMessageFor(error));
    renderActions();
  }

  async function convert() {
    if (!state.file || state.converting || state.loading) return;
    const queue = pendingFiles();
    if (!queue.length) return;

    if (isAi()) {
      const eta = aiEtaSeconds();
      if (eta > 600 && !window.confirm(t('etaConfirm')(formatEta(eta)))) return;
    }

    state.converting = true;
    state.cancelRequested = false;
    state.finishedCount = doneCount();
    tab.classList.add('is-processing');
    tab.classList.remove('is-complete');
    renderActions();
    renderQueue();
    setStatusProcessing(0);

    const errors = [];
    try {
      for (let index = 0; index < state.files.length; index += 1) {
        if (state.cancelRequested) break;
        const file = state.files[index];
        if (state.fileStatus[file.path] === 'done') continue;
        state.activeIndex = index;
        state.file = file;
        state.fileStatus[file.path] = 'processing';
        renderInput();
        renderQueue();
        refreshPlan();
        try {
          const result = await window.pantoUpscale.start({
            inputPath: file.path,
            targetId: state.target,
            mode: state.mode,
            outputDirectory: state.outputDirectory,
            engine: state.engine
          });
          result.inputPath = file.path;
          state.results.push(result);
          state.result = result;
          state.fileStatus[file.path] = 'done';
        } catch (error) {
          const raw = typeof error === 'string' ? error : (error && error.message) || '';
          if (state.cancelRequested || raw.startsWith('CANCELLED')) {
            state.fileStatus[file.path] = 'pending';
            break;
          }
          state.fileStatus[file.path] = 'error';
          errors.push(error);
        }
        state.finishedCount = state.files.filter(
          (item) => state.fileStatus[item.path] === 'done' || state.fileStatus[item.path] === 'error'
        ).length;
        renderQueue();
      }
    } finally {
      state.converting = false;
      tab.classList.remove('is-processing');
    }

    state.file = state.files[0] || null;
    renderInput();
    renderQueue();
    renderOutput();

    if (state.cancelRequested) {
      renderOutput();
      setStatusIdle();
      renderActions();
      return;
    }
    if (!state.results.length) {
      handleError(errors[0] || new Error(t('failed')));
      return;
    }
    tab.classList.add('is-complete');
    if (state.files.length > 1) setStatusBatchSuccess(errors.length);
    else if (errors.length) setStatusError(errorMessageFor(errors[0]));
    else setStatusSuccess(state.result);
    renderActions();
    playChime();
  }

  async function cancel() {
    if (!state.converting) return;
    state.cancelRequested = true;
    cancelButton.disabled = true;
    try {
      await window.pantoUpscale.cancel();
    } catch (_) {
      // The running command reports the final state.
    } finally {
      cancelButton.disabled = false;
    }
  }

  function playChime() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    try {
      const context = new AudioContextClass();
      const now = context.currentTime;
      [660, 880].forEach((frequency, index) => {
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const start = now + index * 0.11;
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.055, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.32);
        oscillator.connect(gain).connect(context.destination);
        oscillator.start(start);
        oscillator.stop(start + 0.36);
      });
      setTimeout(() => context.close(), 900);
    } catch (_) {
      // Audio is a nice-to-have.
    }
  }

  function selectTarget(target) {
    if (state.converting || !TARGETS[target] || target === state.target) return;
    state.target = target;
    clearResults();
    state.planRequest += 1;
    renderTargetSelection();
    renderQueue();
    renderOutput();
    renderActions();
    refreshPlan();
  }

  function selectMode(mode) {
    if (state.converting || !['pad', 'crop', 'stretch'].includes(mode) || mode === state.mode) return;
    state.mode = mode;
    clearResults();
    state.planRequest += 1;
    renderTargetSelection();
    renderQueue();
    renderOutput();
    renderActions();
    refreshPlan();
  }

  const ENGINE_ICONS = {
    lanczos: '<svg viewBox="0 0 20 20"><path d="M3 10h2l2-5 3 10 3-8 2 3h2"/></svg>',
    ai: '<svg viewBox="0 0 20 20"><path d="M10 2l1.8 5.2L17 9l-5.2 1.8L10 16l-1.8-5.2L3 9l5.2-1.8Z"/></svg>'
  };
  const CHECK_SVG = '<svg viewBox="0 0 20 20"><path d="m4 10.5 4 4L16 6"/></svg>';

  function renderEngineBadge() {
    // The badge element was removed in the mockup layout: the status bar
    // title already names the active engine.
    const badge = $('upEngineBadge');
    if (!badge) return;
    if (isAi()) {
      const model = activeModelInfo();
      badge.textContent = model ? model.name : 'Real-ESRGAN';
      badge.title = model ? model.engineLabel : '';
    } else {
      badge.textContent = 'Lanczos';
      badge.title = t('engineTitle');
    }
  }

  function renderModels() {
    const list = $('upModelsList');
    if (!list) return;
    list.textContent = '';
    for (const model of state.models) {
      const row = document.createElement('div');
      row.className = `model-row${model.active ? '' : ' inactive'}`;

      const icon = document.createElement('div');
      icon.className = 'model-icon';
      icon.innerHTML = isAi() ? ENGINE_ICONS.ai : ENGINE_ICONS.lanczos;

      const modelCopy = document.createElement('div');
      modelCopy.className = 'model-copy';
      const name = document.createElement('strong');
      name.textContent = model.name;
      const detail = document.createElement('small');
      detail.textContent = model.engineLabel;
      modelCopy.append(name, detail);

      const status = document.createElement('div');
      status.className = 'model-status';
      const badge = document.createElement('span');
      badge.className = `model-badge${model.active ? ' active' : ''}`;
      badge.textContent = model.active ? t('modelActive') : t('modelReady');
      const size = document.createElement('span');
      size.className = 'model-size';
      size.textContent = model.size > 0 ? formatBytes(model.size) : '—';
      status.append(badge, size);

      const actions = document.createElement('div');
      actions.className = 'model-actions';
      const slot = document.createElement('button');
      slot.className = model.active ? 'check-slot' : 'check-slot empty';
      slot.innerHTML = CHECK_SVG;
      slot.title = model.active ? t('modelActive') : t('useModel');
      slot.setAttribute('aria-label', slot.title);
      if (model.active) slot.disabled = true;
      actions.append(slot);

      row.append(icon, modelCopy, status, actions);
      row.addEventListener('click', async () => {
        if (model.active) return;
        try {
          state.models = await window.pantoUpscale.setEngine(model.id);
          syncEngineFromModels();
        } catch (error) {
          handleError(error);
        }
      });
      list.append(row);
    }
  }

  function syncEngineFromModels() {
    const active = state.models.find((model) => model.active);
    state.engine = active ? active.id : 'lanczos';
    clearResults();
    renderEngineBadge();
    renderModels();
    renderQueue();
    renderOutput();
    renderActions();
    if (!state.converting) setStatusIdle();
  }

  async function loadModels() {
    try {
      state.models = await window.pantoUpscale.listModels();
      const active = state.models.find((model) => model.active);
      state.engine = active ? active.id : 'lanczos';
      renderEngineBadge();
      renderModels();
      renderOutput();
      renderActions();
      if (!state.converting && !state.result) setStatusIdle();
    } catch (_) {
      // Panel stays empty until the backend answers.
    }
  }

  function setModelsView(open) {
    $('upModelsPanel').classList.toggle('hidden', !open);
    if (open) loadModels();
  }

  function applyLanguage(language) {
    if (!COPY[language]) return;
    state.language = language;
    $('upModelsToggle').textContent = t('models');
    $('upModelsToggle').setAttribute('aria-label', t('models'));
    $('upModelsToggle').title = t('models');
    $('upModelsTitle').textContent = t('models');
    $('upModelsSubtitle').textContent = t('modelsSubtitle');
    $('upModelsFoot').textContent = t('modelsFoot');
    $('upModelsClose').setAttribute('aria-label', t('close'));
    $('upModelsClose').title = t('close');
    renderEngineBadge();
    renderModels();
    $('upInputKicker').textContent = t('input');
    $('upOutputKicker').textContent = t('output');
    $('upDropTitle').textContent = t('dropTitle');
    $('upDropHint').textContent = t('dropHint');
    targetGroup.setAttribute('aria-label', t('targetsAria'));
    modeGroup.setAttribute('aria-label', t('modesAria'));
    for (const button of modeGroup.querySelectorAll('[data-mode]')) {
      button.textContent = t('modes')[button.dataset.mode];
    }
    removeButton.setAttribute('aria-label', t('remove'));
    removeButton.title = t('remove');
    renderFolderButton();
    renderInput();
    renderQueue();
    renderOutput();
    renderTargetSelection();
    renderActions();
    if (state.converting) setStatusProcessing(Number(statusRight.textContent.replace('%', '')) || 0);
    else if (state.result) setStatusSuccess(state.result);
    else if (!state.ffmpegAvailable) setStatusError(t('ffmpegMissing'));
    else setStatusIdle();
  }

  function wire() {
    inputCard.addEventListener('click', (event) => {
      if (event.target.closest('#upRemoveButton, #upFolderButton')) return;
      chooseFile();
    });
    inputCard.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        chooseFile();
      }
    });
    removeButton.addEventListener('click', (event) => {
      event.stopPropagation();
      resetFile();
    });
    folderButton.addEventListener('click', (event) => {
      event.stopPropagation();
      chooseOutputFolder();
    });
    targetGroup.addEventListener('click', (event) => {
      const button = event.target.closest('[data-target]');
      if (button) selectTarget(button.dataset.target);
    });
    modeGroup.addEventListener('click', (event) => {
      const button = event.target.closest('[data-mode]');
      if (button) selectMode(button.dataset.mode);
    });
    convertButton.addEventListener('click', convert);
    cancelButton.addEventListener('click', cancel);
    anotherButton.addEventListener('click', resetFile);
    revealButton.addEventListener('click', () => {
      if (state.result) window.pantoUpscale.showInFolder(state.result.outputPath);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && state.converting) {
        event.preventDefault();
        cancel();
      }
    });
    $('upModelsToggle').addEventListener('click', () => {
      setModelsView($('upModelsPanel').classList.contains('hidden'));
    });
    $('upModelsClose').addEventListener('click', () => setModelsView(false));
    window.pantoUpscale.onProgress(({ percent, elapsed, detail }) => {
      if (!state.converting) return;
      const value = Number(percent);
      if (!Number.isFinite(value)) return;
      // Per-file progress from the backend → overall queue progress.
      const total = Math.max(1, state.files.length);
      const overall = total > 1
        ? Math.min(100, ((state.finishedCount + value / 100) / total) * 100)
        : value;
      setStatusProcessing(overall);
      if (isAi() && value > 5 && value < 100 && elapsed > 0) {
        const remaining = Math.max(0, (elapsed * (100 - value)) / value);
        const prefix = total > 1 ? `${state.activeIndex + 1}/${total} · ` : '';
        statusDetail.textContent = `${prefix}${detail ? `${detail} · ` : ''}${t('etaRemaining')} ${formatEta(remaining)}`;
        statusRight.textContent = `${Math.round(overall)}%`;
      }
    });
  }

  function init(language) {
    state.language = COPY[language] ? language : 'es';
    wire();
    applyLanguage(state.language);
    renderTargetSelection();
    renderFolderButton();
    renderActions();
    setStatusIdle();
    loadModels();
    window.pantoUpscale.status()
      .then((status) => {
        if (!status || !status.available) {
          state.ffmpegAvailable = false;
          setStatusError(t('ffmpegMissing'));
          renderActions();
        }
      })
      .catch(() => {});
  }

  window.UpscaleTab = {
    init,
    setLanguage: applyLanguage,
    handleDrop
  };
})();
