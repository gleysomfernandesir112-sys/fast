document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('portfolio-grid');

    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(projects => {
            if (projects.length === 0) {
                grid.innerHTML = '<p>Nenhum projeto encontrado. A automação pode estar em andamento.</p>';
                return;
            }

            projects.forEach(project => {
                const card = document.createElement('a');
                card.href = project.url;
                card.className = 'project-card';
                card.target = '_blank';
                card.rel = 'noopener noreferrer';

                const image = document.createElement('img');
                image.src = project.cover;
                image.alt = `Capa do projeto ${project.title}`;
                
                const title = document.createElement('h3');
                title.textContent = project.title;

                card.appendChild(image);
                card.appendChild(title);
                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os projetos:', error);
            grid.innerHTML = '<p>Não foi possível carregar os projetos. Verifique o console para mais detalhes.</p>';
        });
});
