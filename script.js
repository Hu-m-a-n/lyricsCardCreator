document.addEventListener('DOMContentLoaded', () => {
    const titleInput = document.getElementById('title-input');
    const artistInput = document.getElementById('artist-input');
    const lyricsInput = document.getElementById('lyrics-input');
    const coverInput = document.getElementById('cover-input');
    const coverUrlInput = document.getElementById('cover-url-input');
    const exportButton = document.getElementById('export-button');
    const designSelect = document.getElementById('design-select');

    const titlePreview = document.getElementById('song-title-preview');
    const artistPreview = document.getElementById('artist-name-preview');
    const lyricsPreview = document.getElementById('lyrics-preview');
    const coverPreview = document.getElementById('album-cover-preview');
    const descPreview = document.getElementById('desc-preview');

    const captureArea = document.getElementById('capture-area');

    const titleAlignSelect = document.getElementById('title-align-select');
    const titleSizeSelect = document.getElementById('title-size-select');
    const lyricsAlignSelect = document.getElementById('lyrics-align-select');
    const lyricsSizeSelect = document.getElementById('lyrics-size-select');
    const textContent = document.querySelector('#capture-area .text-content');

    const lyricsWarning = document.getElementById('lyrics-warning');

    // 제목 미리보기 업데이트
    titleInput.addEventListener('input', () => {
        titlePreview.textContent = titleInput.value || '노래 제목';
        updateDesc();
    });

    // 아티스트 미리보기 업데이트
    artistInput.addEventListener('input', () => {
        artistPreview.textContent = artistInput.value || '아티스트';
        updateDesc();
    });

    // 가사 미리보기 업데이트
    lyricsInput.addEventListener('input', () => {
        lyricsPreview.textContent = lyricsInput.value || '노래 가사';
        const lines = lyricsInput.value.split(/\r?\n/);
        if (lines.length > 8) {
            lyricsWarning.style.display = 'block';
        } else {
            lyricsWarning.style.display = 'none';
        }
    });

    // 앨범 커버 미리보기 (파일 업로드)
    coverInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                coverPreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
            // 파일 업로드 시 URL 입력란 초기화
            coverUrlInput.value = '';
        }
    });

    // 앨범 커버 미리보기 (URL 입력)
    coverUrlInput.addEventListener('input', () => {
        const url = coverUrlInput.value.trim();
        if (url) {
            coverPreview.src = url;
            // URL 입력 시 파일 업로드 input 초기화
            coverInput.value = '';
        } else {
            coverPreview.src = 'https://via.placeholder.com/500';
        }
    });

    // 이미지 내보내기
    exportButton.addEventListener('click', () => {
        // 폰트가 이미지에 확실히 포함되도록, 폰트 파일을 직접 불러와서 CSS로 주입하는 방식
        const fontUrl = 'https://fastly.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff';

        // 1. 폰트 파일을 fetch로 가져옴
        fetch(fontUrl)
            .then(response => response.blob())
            // 2. 파일(blob)을 base64 데이터 URL로 변환
            .then(blob => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            }))
            // 3. 변환된 데이터로 @font-face 규칙을 만들어 이미지 생성 옵션으로 전달
            .then(dataUrl => {
                const fontEmbedCss = `@font-face {
                    font-family: 'Pretendard-Regular';
                    src: url(${dataUrl}) format('woff');
                }`;
                
                return htmlToImage.toPng(captureArea, { 
                    quality: 0.98,
                    pixelRatio: 2,
                    fontEmbedCSS: fontEmbedCss // 생성될 이미지에 폰트 주입
                });
            })
            .then(function (dataUrl) {
                const a = document.createElement('a');
                a.href = dataUrl;
                a.download = 'lyrics-card.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            })
            .catch(function (error) {
                console.error('이미지 생성 중 오류 발생!', error);
                alert('이미지 변환에 실패했습니다. 폰트를 불러오는 데 문제가 있을 수 있습니다.');
            });
    });

    function applyCustomStyles() {
        // 제목/아티스트 정렬
        titlePreview.classList.remove('align-center', 'align-left', 'align-right');
        artistPreview.classList.remove('align-center', 'align-left', 'align-right');
        titlePreview.classList.add('align-' + titleAlignSelect.value);
        artistPreview.classList.add('align-' + titleAlignSelect.value);
        // 제목/아티스트 크기
        titlePreview.classList.remove('size-normal', 'size-large', 'title');
        artistPreview.classList.remove('size-normal', 'size-large', 'artist');
        titlePreview.classList.add('size-' + titleSizeSelect.value, 'title');
        artistPreview.classList.add('size-' + titleSizeSelect.value, 'artist');
        // 가사 정렬
        lyricsPreview.classList.remove('align-center', 'align-left', 'align-right');
        lyricsPreview.classList.add('align-' + lyricsAlignSelect.value);
        // 가사 크기
        lyricsPreview.classList.remove('size-normal', 'size-large', 'lyrics');
        lyricsPreview.classList.add('size-' + lyricsSizeSelect.value, 'lyrics');
    }

    function updateDesc() {
        const artist = artistInput.value || '아티스트';
        const title = titleInput.value || '노래 제목';
        descPreview.textContent = `${artist}의 ${title} 中..`;
    }

    // 초기값 적용
    applyCustomStyles();
    updateDesc();

    // 이벤트 리스너 등록
    titleAlignSelect.addEventListener('change', applyCustomStyles);
    titleSizeSelect.addEventListener('change', applyCustomStyles);
    lyricsAlignSelect.addEventListener('change', applyCustomStyles);
    lyricsSizeSelect.addEventListener('change', applyCustomStyles);
}); 