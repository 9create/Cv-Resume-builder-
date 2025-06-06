document.addEventListener('DOMContentLoaded', () => {
    // Get all form elements
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const linkedinInput = document.getElementById('linkedin');
    const githubInput = document.getElementById('github');
    const summaryInput = document.getElementById('summary');
    const skillsInput = document.getElementById('skills');

    const educationSection = document.getElementById('educationSection');
    const addEducationBtn = document.getElementById('addEducation');
    const experienceSection = document.getElementById('experienceSection');
    const addExperienceBtn = document.getElementById('addExperience');

    const generateResumeBtn = document.getElementById('generateResume');
    const downloadResumeBtn = document.getElementById('downloadResume');
    const exportDataBtn = document.getElementById('exportData');
    const importDataBtn = document.getElementById('importDataBtn');
    const importFileInput = document.getElementById('importData');

    // Get all preview elements
    const previewName = document.getElementById('previewName');
    const previewContact = document.getElementById('previewContact');
    const previewLinks = document.getElementById('previewLinks');
    const previewSummary = document.getElementById('previewSummary');
    const previewEducation = document.getElementById('previewEducation');
    const previewExperience = document.getElementById('previewExperience');
    const previewSkills = document.getElementById('previewSkills');

    // --- Event Listeners ---
    generateResumeBtn.addEventListener('click', updateResumePreview);
    downloadResumeBtn.addEventListener('click', () => window.print());
    addEducationBtn.addEventListener('click', () => addItem(educationSection, 'education'));
    addExperienceBtn.addEventListener('click', () => addItem(experienceSection, 'experience'));
    exportDataBtn.addEventListener('click', exportResumeData);
    importDataBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importResumeData);

    // Initial update of resume preview
    updateResumePreview();

    // --- Functions ---

    function updateResumePreview() {
        // Personal Info
        previewName.textContent = nameInput.value || "Your Name";
        
        let contactInfo = [];
        if (emailInput.value) contactInfo.push(emailInput.value);
        if (phoneInput.value) contactInfo.push(phoneInput.value);
        previewContact.textContent = contactInfo.join(' | ');

        let linksInfo = [];
        if (linkedinInput.value) linksInfo.push(`<a href="${linkedinInput.value}" target="_blank">LinkedIn</a>`);
        if (githubInput.value) linksInfo.push(`<a href="${githubInput.value}" target="_blank">GitHub</a>`);
        previewLinks.innerHTML = linksInfo.join(' | ');

        // Summary
        previewSummary.textContent = summaryInput.value;

        // Education
        previewEducation.innerHTML = ''; // Clear previous content
        document.querySelectorAll('.education-item').forEach(item => {
            const degree = item.querySelector('.degree').value;
            const university = item.querySelector('.university').value;
            const dates = item.querySelector('.edu-dates').value;
            const details = item.querySelector('.edu-details').value;

            if (degree && university) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h4>${degree}</h4>
                    <p>${university}, ${dates}</p>
                    ${details ? `<p>${details.replace(/\n/g, '<br>')}</p>` : ''}
                `;
                previewEducation.appendChild(li);
            }
        });

        // Experience
        previewExperience.innerHTML = ''; // Clear previous content
        document.querySelectorAll('.experience-item').forEach(item => {
            const title = item.querySelector('.job-title').value;
            const company = item.querySelector('.company').value;
            const dates = item.querySelector('.exp-dates').value;
            const responsibilities = item.querySelector('.responsibilities').value;

            if (title && company) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <h4>${title} at ${company}</h4>
                    <p>${dates}</p>
                    ${responsibilities ? `<ul>${responsibilities.split('\n').map(r => `<li>${r.trim()}</li>`).join('')}</ul>` : ''}
                `;
                previewExperience.appendChild(li);
            }
        });

        // Skills
        previewSkills.textContent = skillsInput.value;
    }

    function addItem(sectionElement, type) {
        const div = document.createElement('div');
        div.classList.add(`${type}-item`);
        
        let content = '';
        if (type === 'education') {
            content = `
                <input type="text" class="degree" placeholder="Degree/Course (e.g., B.Tech Computer Science)">
                <input type="text" class="university" placeholder="University/Institution">
                <input type="text" class="edu-dates" placeholder="Dates Attended (e.g., 2018 - 2022)">
                <textarea class="edu-details" placeholder="Relevant coursework, honors, or achievements"></textarea>
            `;
        } else if (type === 'experience') {
            content = `
                <input type="text" class="job-title" placeholder="Job Title (e.g., Software Engineer)">
                <input type="text" class="company" placeholder="Company Name">
                <input type="text" class="exp-dates" placeholder="Dates (e.g., Jan 2022 - Present)">
                <textarea class="responsibilities" placeholder="Key responsibilities and achievements (use bullet points)"></textarea>
            `;
        }

        div.innerHTML = content + `<button type="button" class="remove-item-btn">Remove</button>`;
        sectionElement.insertBefore(div, sectionElement.querySelector(`#add${capitalizeFirstLetter(type)}`));

        div.querySelector('.remove-item-btn').addEventListener('click', () => {
            div.remove();
            updateResumePreview(); // Update preview after removing
        });
        
        // Add event listeners to newly created inputs for live updates
        div.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', updateResumePreview);
        });
    }

    // Function to capitalize first letter for dynamic button IDs
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // --- Data Export/Import ---
    function exportResumeData() {
        const data = {
            personal: {
                name: nameInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                linkedin: linkedinInput.value,
                github: githubInput.value
            },
            summary: summaryInput.value,
            education: [],
            experience: [],
            skills: skillsInput.value
        };

        document.querySelectorAll('.education-item').forEach(item => {
            data.education.push({
                degree: item.querySelector('.degree').value,
                university: item.querySelector('.university').value,
                dates: item.querySelector('.edu-dates').value,
                details: item.querySelector('.edu-details').value
            });
        });

        document.querySelectorAll('.experience-item').forEach(item => {
            data.experience.push({
                title: item.querySelector('.job-title').value,
                company: item.querySelector('.company').value,
                dates: item.querySelector('.exp-dates').value,
                responsibilities: item.querySelector('.responsibilities').value
            });
        });

        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'resume_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function importResumeData(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    populateForm(data);
                    updateResumePreview();
                } catch (error) {
                    alert('Error parsing JSON file. Please ensure it\'s a valid JSON.');
                    console.error('JSON parsing error:', error);
                }
            };
            reader.readAsText(file);
        }
    }

    function populateForm(data) {
        // Personal Info
        nameInput.value = data.personal.name || '';
        emailInput.value = data.personal.email || '';
        phoneInput.value = data.personal.phone || '';
        linkedinInput.value = data.personal.linkedin || '';
        githubInput.value = data.personal.github || '';
        
        // Summary
        summaryInput.value = data.summary || '';

        // Skills
        skillsInput.value = data.skills || '';

        // Education
        // Clear existing education items except the first (template)
        document.querySelectorAll('.education-item:not(:first-child)').forEach(item => item.remove());
        const firstEduItem = document.querySelector('.education-item');
        if (data.education && data.education.length > 0) {
            firstEduItem.querySelector('.degree').value = data.education[0].degree || '';
            firstEduItem.querySelector('.university').value = data.education[0].university || '';
            firstEduItem.querySelector('.edu-dates').value = data.education[0].dates || '';
            firstEduItem.querySelector('.edu-details').value = data.education[0].details || '';

            for (let i = 1; i < data.education.length; i++) {
                addItem(educationSection, 'education');
                const newItem = document.querySelectorAll('.education-item')[i];
                newItem.querySelector('.degree').value = data.education[i].degree || '';
                newItem.querySelector('.university').value = data.education[i].university || '';
                newItem.querySelector('.edu-dates').value = data.education[i].dates || '';
                newItem.querySelector('.edu-details').value = data.education[i].details || '';
            }
        } else { // Clear if no data
            firstEduItem.querySelector('.degree').value = '';
            firstEduItem.querySelector('.university').value = '';
            firstEduItem.querySelector('.edu-dates').value = '';
            firstEduItem.querySelector('.edu-details').value = '';
        }

        // Experience
        // Clear existing experience items except the first (template)
        document.querySelectorAll('.experience-item:not(:first-child)').forEach(item => item.remove());
        const firstExpItem = document.querySelector('.experience-item');
        if (data.experience && data.experience.length > 0) {
            firstExpItem.querySelector('.job-title').value = data.experience[0].title || '';
            firstExpItem.querySelector('.company').value = data.experience[0].company || '';
            firstExpItem.querySelector('.exp-dates').value = data.experience[0].dates || '';
            firstExpItem.querySelector('.responsibilities').value = data.experience[0].responsibilities || '';

            for (let i = 1; i < data.experience.length; i++) {
                addItem(experienceSection, 'experience');
                const newItem = document.querySelectorAll('.experience-item')[i];
                newItem.querySelector('.job-title').value = data.experience[i].title || '';
                newItem.querySelector('.company').value = data.experience[i].company || '';
                newItem.querySelector('.exp-dates').value = data.experience[i].dates || '';
                newItem.querySelector('.responsibilities').value = data.experience[i].responsibilities || '';
            }
        } else { // Clear if no data
            firstExpItem.querySelector('.job-title').value = '';
            firstExpItem.querySelector('.company').value = '';
            firstExpItem.querySelector('.exp-dates').value = '';
            firstExpItem.querySelector('.responsibilities').value = '';
        }
    }
});
