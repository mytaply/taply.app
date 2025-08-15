document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('viewInput');
    const viewEl  = document.getElementById('view');

    // Format numeric strings: 1,000 -> 1K, 1,000,000 -> 1M, etc.
    function formatNumberString(val) {
      // Remove commas and whitespace
      const cleaned = val.toString().replace(/,/g, '').trim();
      // Try to parse as number
      const num = parseFloat(cleaned);
      if (isNaN(num)) {
        // Not a number: return original
        return val;
      }
      const abs = Math.abs(num);
      if (abs >= 1e6) {
        return (num / 1e6).toFixed(2).replace(/\.00$/, '') + 'M';
      }
      if (abs >= 1e3) {
        return (num / 1e3).toFixed(2).replace(/\.00$/, '') + 'K';
      }
      // For smaller numbers, preserve original formatting
      return num.toString();
    }

    // Function to update the view span with formatting
    const updateView = (val) => {
      viewEl.textContent = formatNumberString(val);
    };

    // Initialize with any existing value
    updateView(inputEl.value);

    // Update on user input
    inputEl.addEventListener('input', (event) => {
      updateView(event.target.value);
    });

    // Poll for programmatic changes to `value` property (advanced)
    let lastValue = inputEl.value;
    setInterval(() => {
      if (inputEl.value !== lastValue) {
        lastValue = inputEl.value;
        updateView(lastValue);
      }
    }, 100);
  });