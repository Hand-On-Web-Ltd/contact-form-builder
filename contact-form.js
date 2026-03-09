/**
 * Contact Form Builder
 * Drag-and-drop form builder with honeypot spam protection
 * https://www.handonweb.com
 */

(function () {
    var preview = document.getElementById('formPreview');
    var dropHint = document.getElementById('dropHint');
    var fields = [];
    var fieldCounter = 0;

    // Field templates
    var templates = {
        name: { label: 'Your Name', type: 'text', placeholder: 'John Smith', required: true },
        email: { label: 'Email Address', type: 'email', placeholder: 'john@example.com', required: true },
        phone: { label: 'Phone Number', type: 'tel', placeholder: '+44 1234 567890', required: false },
        message: { label: 'Message', type: 'textarea', placeholder: 'How can we help?', required: true },
        dropdown: { label: 'Subject', type: 'select', options: ['General Enquiry', 'Quote Request', 'Support', 'Other'], required: false },
        checkbox: { label: 'I agree to the privacy policy', type: 'checkbox', required: true }
    };

    // Drag from toolbox
    document.querySelectorAll('.field-btn').forEach(function (btn) {
        btn.addEventListener('dragstart', function (e) {
            e.dataTransfer.setData('field-type', btn.getAttribute('data-type'));
        });
    });

    // Drop zone
    preview.addEventListener('dragover', function (e) {
        e.preventDefault();
        preview.classList.add('drag-over');
    });

    preview.addEventListener('dragleave', function () {
        preview.classList.remove('drag-over');
    });

    preview.addEventListener('drop', function (e) {
        e.preventDefault();
        preview.classList.remove('drag-over');
        var type = e.dataTransfer.getData('field-type');
        if (type && templates[type]) {
            addField(type);
        }
    });

    // Also support click to add
    document.querySelectorAll('.field-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var type = btn.getAttribute('data-type');
            addField(type);
        });
    });

    function addField(type) {
        var template = templates[type];
        var id = 'field_' + (++fieldCounter);
        var field = {
            id: id,
            type: type,
            inputType: template.type,
            label: template.label,
            placeholder: template.placeholder || '',
            options: template.options || [],
            required: template.required
        };

        fields.push(field);
        renderPreview();
    }

    function removeField(id) {
        fields = fields.filter(function (f) { return f.id !== id; });
        renderPreview();
    }

    function renderPreview() {
        if (fields.length === 0) {
            dropHint.style.display = 'block';
            // Remove all field elements but keep hint
            var fieldEls = preview.querySelectorAll('.form-field, .preview-submit');
            fieldEls.forEach(function (el) { el.remove(); });
            return;
        }

        dropHint.style.display = 'none';

        // Clear existing fields
        var existing = preview.querySelectorAll('.form-field, .preview-submit');
        existing.forEach(function (el) { el.remove(); });

        fields.forEach(function (field) {
            var div = document.createElement('div');
            div.className = 'form-field';
            div.setAttribute('data-field-id', field.id);

            var removeBtn = '<button class="field-remove" onclick="window._cfbRemove(\'' + field.id + '\')">&times;</button>';

            if (field.inputType === 'textarea') {
                div.innerHTML =
                    '<label>' + field.label + (field.required ? ' *' : '') + '</label>' +
                    '<textarea placeholder="' + field.placeholder + '" disabled></textarea>' +
                    removeBtn;
            } else if (field.inputType === 'select') {
                var opts = field.options.map(function (o) { return '<option>' + o + '</option>'; }).join('');
                div.innerHTML =
                    '<label>' + field.label + (field.required ? ' *' : '') + '</label>' +
                    '<select disabled>' + opts + '</select>' +
                    removeBtn;
            } else if (field.inputType === 'checkbox') {
                div.innerHTML =
                    '<div class="checkbox-row"><input type="checkbox" disabled> <label>' + field.label + (field.required ? ' *' : '') + '</label></div>' +
                    removeBtn;
            } else {
                div.innerHTML =
                    '<label>' + field.label + (field.required ? ' *' : '') + '</label>' +
                    '<input type="' + field.inputType + '" placeholder="' + field.placeholder + '" disabled>' +
                    removeBtn;
            }

            preview.appendChild(div);
        });

        // Add submit button preview
        var submitDiv = document.createElement('div');
        submitDiv.className = 'preview-submit';
        submitDiv.innerHTML = '<button>Send Message</button>';
        preview.appendChild(submitDiv);
    }

    // Expose remove function
    window._cfbRemove = removeField;

    // Generate embed code
    window.generateCode = function () {
        if (fields.length === 0) {
            alert('Add some fields first!');
            return;
        }

        var method = document.getElementById('submitMethod').value;
        var target = document.getElementById('submitTarget').value || 'you@example.com';

        var html = '';
        html += '<form id="contact-form"';
        if (method === 'mailto') {
            html += ' action="mailto:' + target + '" method="POST" enctype="text/plain"';
        }
        html += '>\n';

        // Honeypot field
        html += '  <!-- Honeypot - hidden from real users, catches bots -->\n';
        html += '  <div style="position:absolute;left:-9999px;top:-9999px;" aria-hidden="true">\n';
        html += '    <input type="text" name="website_url" tabindex="-1" autocomplete="off">\n';
        html += '  </div>\n\n';

        fields.forEach(function (field) {
            var name = field.label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
            var req = field.required ? ' required' : '';

            if (field.inputType === 'textarea') {
                html += '  <div class="form-group">\n';
                html += '    <label for="' + name + '">' + field.label + '</label>\n';
                html += '    <textarea id="' + name + '" name="' + name + '" placeholder="' + field.placeholder + '"' + req + '></textarea>\n';
                html += '  </div>\n\n';
            } else if (field.inputType === 'select') {
                html += '  <div class="form-group">\n';
                html += '    <label for="' + name + '">' + field.label + '</label>\n';
                html += '    <select id="' + name + '" name="' + name + '"' + req + '>\n';
                field.options.forEach(function (o) {
                    html += '      <option value="' + o + '">' + o + '</option>\n';
                });
                html += '    </select>\n';
                html += '  </div>\n\n';
            } else if (field.inputType === 'checkbox') {
                html += '  <div class="form-group">\n';
                html += '    <label><input type="checkbox" name="' + name + '"' + req + '> ' + field.label + '</label>\n';
                html += '  </div>\n\n';
            } else {
                html += '  <div class="form-group">\n';
                html += '    <label for="' + name + '">' + field.label + '</label>\n';
                html += '    <input type="' + field.inputType + '" id="' + name + '" name="' + name + '" placeholder="' + field.placeholder + '"' + req + '>\n';
                html += '  </div>\n\n';
            }
        });

        html += '  <button type="submit">Send Message</button>\n';
        html += '</form>\n\n';

        // Add submission script for webhook
        if (method === 'webhook') {
            html += '<script>\n';
            html += 'document.getElementById("contact-form").addEventListener("submit", function(e) {\n';
            html += '  e.preventDefault();\n';
            html += '  // Check honeypot\n';
            html += '  if (this.querySelector("[name=website_url]").value) return;\n';
            html += '  var data = new FormData(this);\n';
            html += '  fetch("' + target + '", {\n';
            html += '    method: "POST",\n';
            html += '    body: JSON.stringify(Object.fromEntries(data)),\n';
            html += '    headers: { "Content-Type": "application/json" }\n';
            html += '  }).then(function() {\n';
            html += '    alert("Message sent! We\\'ll get back to you soon.");\n';
            html += '  }).catch(function() {\n';
            html += '    alert("Something went wrong. Please try again.");\n';
            html += '  });\n';
            html += '});\n';
            html += '</' + 'script>\n';
        } else {
            html += '<script>\n';
            html += 'document.getElementById("contact-form").addEventListener("submit", function(e) {\n';
            html += '  // Check honeypot\n';
            html += '  if (this.querySelector("[name=website_url]").value) { e.preventDefault(); return; }\n';
            html += '});\n';
            html += '</' + 'script>\n';
        }

        var output = document.getElementById('codeOutput');
        var textarea = document.getElementById('embedCode');
        output.style.display = 'block';
        textarea.value = html;
    };

    window.copyCode = function () {
        var textarea = document.getElementById('embedCode');
        textarea.select();
        document.execCommand('copy');
        var btn = document.querySelector('.btn-copy');
        btn.textContent = 'Copied!';
        setTimeout(function () { btn.textContent = 'Copy Code'; }, 2000);
    };
})();
