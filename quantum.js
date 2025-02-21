class QuantumCircuit {
  constructor() {
    // Initialize quantum system parameters
    this.qubits = [];
    this.maxQubits = 5;
    this.gates = [];
    this.errorRate = 0.02;
    this.coherenceTime = 100; // microseconds
    this.gateTime = {
      'H': 50,    // nanoseconds
      'X': 40,
      'Y': 40,
      'Z': 40,
      'S': 35,
      'T': 35,
      'Rx': 60,
      'Ry': 60,
      'Rz': 60,
      'CNOT': 120,
      'CZ': 150,
      'SWAP': 200,
      'CCX': 300,
      'M': 40
    };
    
    // Gate error rates based on real IBM Q hardware
    this.gateErrors = {
      'H': 0.001,
      'X': 0.001,
      'Y': 0.001,
      'Z': 0.001,
      'S': 0.0015,
      'T': 0.0015,
      'Rx': 0.002,
      'Ry': 0.002,
      'Rz': 0.002,
      'CNOT': 0.01,
      'CZ': 0.01,
      'SWAP': 0.015,
      'CCX': 0.02,
      'M': 0.005
    };

    // Enhanced gate characteristics
    this.gateProperties = {
      'H': { affectsPhase: true, universal: true },
      'X': { affectsPhase: false, universal: false },
      'Y': { affectsPhase: true, universal: false },
      'Z': { affectsPhase: true, universal: false },
      'S': { affectsPhase: true, universal: false },
      'T': { affectsPhase: true, universal: true },
      'Rx': { affectsPhase: false, universal: true, parametric: true },
      'Ry': { affectsPhase: false, universal: true, parametric: true },
      'Rz': { affectsPhase: true, universal: true, parametric: true },
      'CNOT': { entangling: true, universal: true },
      'CZ': { entangling: true, universal: false },
      'SWAP': { entangling: true, universal: false },
      'CCX': { entangling: true, universal: false },
      'M': { measurement: true }
    };
    
    // Cities for logistics optimization
    this.cities = [
      { name: 'Madrid', x: 0, y: 0, connectivity: [1, 2, 3] },
      { name: 'Barcelona', x: 500, y: 100, connectivity: [0, 2, 4] },
      { name: 'Valencia', x: 300, y: 200, connectivity: [0, 1, 3] },
      { name: 'Sevilla', x: 100, y: 400, connectivity: [0, 2, 4] },
      { name: 'Bilbao', x: 200, y: -100, connectivity: [1, 3] }
    ];

    // Enhanced preset configurations with realistic IBM-like parameters
    this.presetConfigurations = {
      logistics: {
        qubits: 4,
        gates: [
          { type: 'H', qubit: 0, position: 50, angle: Math.PI/2 },
          { type: 'CNOT', qubit: [0, 1], position: 100 },
          { type: 'RZ', qubit: 1, position: 150, angle: Math.PI/4 },
          { type: 'H', qubit: 2, position: 50, angle: Math.PI/2 },
          { type: 'CNOT', qubit: [2, 3], position: 100 },
          { type: 'RX', qubit: 3, position: 150, angle: Math.PI/6 }
        ],
        description: 'Optimización de rutas logísticas usando QAOA'
      }
    };

    // Initialize with DOM check
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeCircuit());
    } else {
      this.initializeCircuit();
    }
    
    // Initialize theme
    this.initializeTheme();
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.createThemeSwitch();
  }

  createThemeSwitch() {
    const themeSwitch = document.createElement('div');
    themeSwitch.className = 'theme-switch';
    
    const button = document.createElement('button');
    button.innerHTML = `
      <svg class="theme-icon" viewBox="0 0 24 24">
        <path class="sun-icon" d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
        <path class="moon-icon" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
      </svg>
      <span>Cambiar tema</span>
    `;
    
    button.addEventListener('click', () => this.toggleTheme());
    themeSwitch.appendChild(button);
    document.body.appendChild(themeSwitch);
  }

  toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Update visualization if it exists
    const results = this.gates.length > 0 ? this.simulateQuantumCircuit() : [];
    this.updateVisualization(results);
  }

  initializeCircuit() {
    // Initialize basic circuit structure
    this.addQubit(); // Add initial qubit
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Setup preset circuit after DOM is ready
    setTimeout(() => {
      this.setupPresetCircuit('logistics');
    }, 100);
  }

  setupEventListeners() {
    document.getElementById('addQubit').addEventListener('click', () => this.addQubit());
    document.getElementById('removeQubit').addEventListener('click', () => this.removeQubit());
    document.getElementById('reset').addEventListener('click', () => this.reset());
    document.getElementById('run').addEventListener('click', () => this.runSimulation());

    // Set up drag and drop for gates
    this.setupGateDragAndDrop();
  }

  setupGateDragAndDrop() {
    const gates = document.querySelectorAll('.gate:not(.placed)');
    
    gates.forEach(gate => {
      gate.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', gate.dataset.gate);
        gate.classList.add('dragging');
        
        // Create drag image
        const dragImage = gate.cloneNode(true);
        dragImage.style.transform = 'translate(-50%, -50%)';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 20, 20);
        setTimeout(() => document.body.removeChild(dragImage), 0);
      });
      
      gate.addEventListener('dragend', () => {
        gate.classList.remove('dragging');
      });
    });

    // Set up drop zones
    const wires = document.querySelectorAll('.qubit-wire');
    wires.forEach(wire => {
      this.setupDropZone(wire, wire.dataset.qubit);
    });
  }

  setupDropZone(wire, qubitIndex) {
    wire.addEventListener('dragenter', (e) => {
      e.preventDefault();
      wire.classList.add('dragover');
    });

    wire.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wire.classList.add('dragover');
      
      // Show visual feedback for gate placement
      const rect = wire.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const snapTo = Math.round(x / 50) * 50;
      
      // Remove previous preview if exists
      const prevPreview = wire.querySelector('.gate-preview');
      if (prevPreview) prevPreview.remove();
      
      // Create preview element
      const preview = document.createElement('div');
      preview.className = 'gate gate-preview';
      preview.style.left = `${snapTo}px`;
      preview.style.opacity = '0.5';
      wire.appendChild(preview);
    });

    wire.addEventListener('dragleave', (e) => {
      e.preventDefault();
      wire.classList.remove('dragover');
      // Remove preview
      const preview = wire.querySelector('.gate-preview');
      if (preview) preview.remove();
    });

    wire.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      wire.classList.remove('dragover');
      
      // Remove preview
      const preview = wire.querySelector('.gate-preview');
      if (preview) preview.remove();
      
      this.handleGateDrop(e, parseInt(qubitIndex));
    });
  }

  handleGateDrop(e, qubitIndex) {
    const gateType = e.dataTransfer.getData('text/plain');
    const wire = e.target.closest('.qubit-wire');
    
    if (!wire) return;
    
    // Calculate drop position
    const rect = wire.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const snapTo = Math.round(x / 50) * 50;
    
    // Check for gate compatibility
    if (this.gateProperties[gateType]?.entangling) {
      // Highlight potential control qubits
      this.showControlQubitOptions(qubitIndex, gateType);
      return;
    }
    
    // Check if position is already occupied
    const existingGate = wire.querySelector(`.gate[style*="left: ${snapTo}px"]`);
    if (existingGate) return;
    
    // Create gate element
    const gate = document.createElement('div');
    gate.className = 'gate placed';
    gate.textContent = gateType;
    gate.style.left = `${snapTo}px`;
    
    // Add parametric control if needed
    if (this.gateProperties[gateType]?.parametric) {
      const angle = prompt('Ingrese el ángulo de rotación (en radianes):', '0');
      if (angle !== null) {
        gate.dataset.angle = angle;
        gate.title = `${gateType}(${angle})`;
      }
    }
    
    // Add delete capability
    gate.addEventListener('click', () => {
      gate.remove();
      this.removeGate(qubitIndex, snapTo);
    });
    
    wire.appendChild(gate);
    
    // Add to gates array
    this.gates.push({
      type: gateType,
      qubit: qubitIndex,
      position: snapTo,
      angle: gate.dataset.angle
    });
    
    // Add visual feedback
    gate.style.animation = 'quantum-place 0.3s ease-out';
  }

  showControlQubitOptions(targetQubit, gateType) {
    const wires = document.querySelectorAll('.qubit-wire');
    wires.forEach((wire, index) => {
      if (index !== targetQubit) {
        wire.classList.add('potential-control');
        wire.addEventListener('click', () => {
          this.createControlledGate(targetQubit, index, gateType);
          this.clearControlQubitOptions();
        }, { once: true });
      }
    });
  }

  clearControlQubitOptions() {
    document.querySelectorAll('.potential-control').forEach(wire => {
      wire.classList.remove('potential-control');
    });
  }

  createControlledGate(targetQubit, controlQubit, gateType) {
    // Create visual connection between control and target qubits
    const controlWire = document.querySelector(`.qubit-wire[data-qubit="${controlQubit}"]`);
    const targetWire = document.querySelector(`.qubit-wire[data-qubit="${targetQubit}"]`);
    
    const gate = document.createElement('div');
    gate.className = 'gate placed controlled';
    gate.textContent = gateType;
    gate.style.left = '100px';
    
    const connector = document.createElement('div');
    connector.className = 'quantum-connector';
    
    targetWire.appendChild(gate);
    controlWire.appendChild(connector);
    
    this.gates.push({
      type: gateType,
      qubit: [targetQubit, controlQubit],
      position: 100
    });
  }

  addQubit() {
    if (this.qubits.length >= this.maxQubits) return;
    
    const qubitIndex = this.qubits.length;
    const qubitLine = document.createElement('div');
    qubitLine.className = 'qubit-line';
    qubitLine.innerHTML = `
      <div class="qubit-label">q${qubitIndex}</div>
      <div class="qubit-wire" data-qubit="${qubitIndex}"></div>
    `;

    document.getElementById('circuit-container').appendChild(qubitLine);
    this.qubits.push({ index: qubitIndex, gates: [] });

    // Setup drop zone for the new qubit
    const wire = qubitLine.querySelector('.qubit-wire');
    this.setupDropZone(wire, qubitIndex);
  }

  removeGate(qubitIndex, position) {
    this.gates = this.gates.filter(gate => 
      !(gate.qubit === qubitIndex && gate.position === position)
    );
  }

  removeQubit() {
    if (this.qubits.length <= 1) return;

    const container = document.getElementById('circuit-container');
    container.removeChild(container.lastChild);
    this.qubits.pop();
    
    // Remove gates associated with the removed qubit
    this.gates = this.gates.filter(gate => gate.qubit < this.qubits.length);
  }

  reset() {
    this.gates = [];
    const wires = document.querySelectorAll('.qubit-wire');
    wires.forEach(wire => {
      const gates = wire.querySelectorAll('.gate');
      gates.forEach(gate => gate.remove());
    });
    this.updateVisualization([]);
  }

  runSimulation() {
    // Simulación simplificada de resultados cuánticos
    const results = this.simulateQuantumCircuit();
    this.updateVisualization(results);
  }

  simulateQuantumCircuit() {
    // Enhanced quantum simulation with realistic noise model
    const results = this.simulateQAOA();
    const noisyResults = this.applyQuantumNoise(results);
    return this.applyMeasurementErrors(noisyResults);
  }

  applyQuantumNoise(results) {
    results.forEach(result => {
      // Calculate total circuit time
      const totalTime = Math.max(...this.gates.map(gate => gate.position * this.gateTime[gate.type] / 1000)); // Convert to microseconds
      
      // Apply T1 and T2 relaxation
      const T1decay = Math.exp(-totalTime / this.coherenceTime);
      const T2decay = Math.exp(-totalTime / this.coherenceTime);
      
      // Apply gate-specific errors
      const gateErrors = this.gates.reduce((acc, gate) => {
        const baseError = this.errorRate;
        const gateSpecificError = 1 - Math.exp(-this.gateTime[gate.type] / 1000);
        return acc * (1 - baseError) * (1 - gateSpecificError);
      }, 1);

      // Update probability with realistic noise effects
      result.probability *= T1decay * T2decay * gateErrors;
      
      // Add detailed quantum metrics
      result.quantumMetrics = {
        fidelity: (T1decay * T2decay * 100).toFixed(2) + '%',
        coherence: {
          T1: (T1decay * 100).toFixed(2) + '%',
          T2: (T2decay * 100).toFixed(2) + '%'
        },
        gateErrors: ((1 - gateErrors) * 100).toFixed(2) + '%',
        readoutFidelity: ((1 - this.errorRate) * 100).toFixed(2) + '%'
      };
    });

    return this.normalizeResults(results);
  }

  applyMeasurementErrors(results) {
    return results.map(result => {
      // Simulate measurement error based on qubit readout error rate
      const measuredProb = result.probability * (1 - this.errorRate) +
                          (1 - result.probability) * this.errorRate;
      return {
        ...result,
        probability: measuredProb,
        confidence: 1 - this.errorRate
      };
    });
  }

  normalizeResults(results) {
    const total = results.reduce((sum, r) => sum + r.probability, 0);
    return results.map(r => ({
      ...r,
      probability: r.probability / total
    }));
  }

  simulateQAOA() {
    // Simplified QAOA (Quantum Approximate Optimization Algorithm) simulation
    const numCities = this.cities.length;
    const numStates = Math.pow(2, this.qubits.length);
    let results = [];

    // Calculate distances between cities
    const distances = {};
    for (let i = 0; i < numCities; i++) {
      for (let j = 0; j < numCities; j++) {
        if (i !== j) {
          const dx = this.cities[i].x - this.cities[j].x;
          const dy = this.cities[i].y - this.cities[j].y;
          distances[`${i}-${j}`] = Math.sqrt(dx * dx + dy * dy);
        }
      }
    }

    // Generate possible routes with weighted probabilities
    for (let i = 0; i < numStates; i++) {
      const route = this.generateValidRoute(numCities);
      const distance = this.calculateRouteDistance(route, distances);
      const quality = 1 / (distance + 1); // Convert distance to quality score
      
      results.push({
        state: route.join(''),
        probability: quality,
        route: route.map(idx => this.cities[idx].name),
        distance: Math.round(distance)
      });
    }

    // Normalize probabilities
    const totalQuality = results.reduce((sum, r) => sum + r.probability, 0);
    results.forEach(r => r.probability /= totalQuality);

    // Sort by probability (best solutions first)
    results.sort((a, b) => b.probability - a.probability);
    
    return results.slice(0, 8); // Return top 8 solutions
  }

  generateValidRoute(numCities) {
    let route = Array.from({length: numCities}, (_, i) => i);
    // Fisher-Yates shuffle
    for (let i = route.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [route[i], route[j]] = [route[j], route[i]];
    }
    return route;
  }

  calculateRouteDistance(route, distances) {
    let totalDistance = 0;
    for (let i = 0; i < route.length; i++) {
      const from = route[i];
      const to = route[(i + 1) % route.length];
      totalDistance += distances[`${from}-${to}`];
    }
    return totalDistance;
  }

  setupPresetCircuit(type) {
    const preset = this.presetConfigurations[type];
    if (!preset) return;
    
    // Reset current circuit
    this.reset();
    
    // Add required qubits
    while (this.qubits.length < preset.qubits) {
      this.addQubit();
    }
    
    // Add preset gates with delay to ensure DOM elements are ready
    setTimeout(() => {
      preset.gates.forEach(gate => {
        const targetQubit = Array.isArray(gate.qubit) ? gate.qubit[0] : gate.qubit;
        const wire = document.querySelector(`.qubit-wire[data-qubit="${targetQubit}"]`);
        
        if (wire) {
          this.addPresetGate(gate);
        }
      });
    }, 200);
  }

  addPresetGate(gateInfo) {
    const targetQubit = Array.isArray(gateInfo.qubit) ? gateInfo.qubit[0] : gateInfo.qubit;
    const wire = document.querySelector(`.qubit-wire[data-qubit="${targetQubit}"]`);
    
    if (!wire) return;
    
    const gate = document.createElement('div');
    gate.className = 'gate placed preset';
    gate.textContent = gateInfo.type;
    gate.style.left = `${gateInfo.position}px`;
    
    // Add delete capability
    gate.addEventListener('click', () => {
      gate.remove();
      this.removeGate(targetQubit, gateInfo.position);
    });
    
    wire.appendChild(gate);
    
    // Add to gates array
    this.gates.push({
      type: gateInfo.type,
      qubit: targetQubit,
      position: gateInfo.position,
      ...(Array.isArray(gateInfo.qubit) ? { target: gateInfo.qubit[1] } : {})
    });
  }

  updateVisualization(results) {
    const visualization = document.getElementById('visualization');
    visualization.innerHTML = '';

    // Add IBM-style quantum metrics
    const metricsDiv = document.createElement('div');
    metricsDiv.className = 'quantum-metrics';
    metricsDiv.innerHTML = `
      <h4>Quantum System Metrics:</h4>
      <div class="metrics-grid">
        <div class="metric">
          <span class="metric-label">Coherence Time:</span>
          <span class="metric-value">${this.coherenceTime}μs</span>
        </div>
        <div class="metric">
          <span class="metric-label">Gate Error Rate:</span>
          <span class="metric-value">${(this.errorRate * 100).toFixed(2)}%</span>
        </div>
        <div class="metric">
          <span class="metric-label">Circuit Depth:</span>
          <span class="metric-value">${Math.max(...this.gates.map(g => g.position)) / 50}</span>
        </div>
      </div>
    `;
    visualization.appendChild(metricsDiv);

    // Create probability graph
    const graphDiv = document.createElement('div');
    graphDiv.id = 'probability-graph';
    graphDiv.className = 'probability-graph';
    visualization.appendChild(graphDiv);

    // Set up SVG dimensions
    const margin = {top: 20, right: 20, bottom: 40, left: 60};
    const width = 600 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select('#probability-graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1)
      .domain(results.map(d => d.route.join('→')));

    const y = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(results, d => d.probability)]);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end')
      .style('font-size', '10px');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')));

    // Add bars
    svg.selectAll('.bar')
      .data(results)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => x(d.route.join('→')))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.probability))
      .attr('height', d => height - y(d.probability))
      .attr('fill', 'url(#gradient)')
      .attr('rx', 4)
      .attr('ry', 4);

    // Add gradient definition
    const gradient = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '0%')
      .attr('y2', '100%');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('style', 'stop-color: #0f62fe; stop-opacity: 1');

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('style', 'stop-color: #1192e8; stop-opacity: 0.8');

    // Add labels
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .text('Probabilidad');

    // Create results table
    const table = document.createElement('table');
    table.className = 'results-table';
    
    // Header
    const header = table.createTHead();
    const headerRow = header.insertRow();
    ['Ruta', 'Distancia (km)', 'Probabilidad', 'Calidad'].forEach(text => {
      const th = document.createElement('th');
      th.textContent = text;
      headerRow.appendChild(th);
    });

    // Body
    const tbody = table.createTBody();
    results.forEach(result => {
      const row = tbody.insertRow();
      
      // Route
      const routeCell = row.insertCell();
      routeCell.textContent = result.route.join(' → ');
      
      // Distance
      const distanceCell = row.insertCell();
      distanceCell.textContent = `${result.distance}`;
      
      // Probability
      const probCell = row.insertCell();
      probCell.textContent = `${(result.probability * 100).toFixed(2)}%`;
      
      // Quality indicator
      const qualityCell = row.insertCell();
      const quality = Math.round((1 - result.probability) * 5);
      qualityCell.textContent = '★'.repeat(5 - quality) + '☆'.repeat(quality);
    });

    visualization.appendChild(table);
  }
}

// Initialize the quantum circuit after DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  window.circuit = new QuantumCircuit();
});