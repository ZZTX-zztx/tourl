// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const previewSection = document.getElementById('preview-section');
    const previewImg = document.getElementById('preview-img');
    const urlSection = document.getElementById('url-section');
    const urlOutput = document.getElementById('url-output');
    const copyBtn = document.getElementById('copy-btn');
    const resetBtn = document.getElementById('reset-btn');
    const toast = document.getElementById('toast');
    
    // 上传区域点击触发文件选择
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // 拖拽功能
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            handleFile(fileInput.files[0]);
        }
    });
    
    // 文件选择后处理
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            handleFile(fileInput.files[0]);
        }
    });
    
    // 处理上传的文件
    function handleFile(file) {
        // 验证文件类型
        if (!file.type.startsWith('image/')) {
            showToast('请上传有效的图片文件！');
            return;
        }
        
        // 读取文件并生成Base64 URL
        const reader = new FileReader();
        
        reader.onload = (e) => {
            // 显示预览图
            previewImg.src = e.target.result;
            previewSection.style.display = 'block';
            
            // 显示URL
            urlOutput.value = e.target.result;
            urlSection.style.display = 'block';
        };
        
        reader.readAsDataURL(file);
    }
    
    // 复制URL
    copyBtn.addEventListener('click', () => {
        if (!urlOutput.value) {
            showToast('没有可复制的URL！');
            return;
        }
        
        // 兼容新版浏览器的复制API
        if (navigator.clipboard) {
            navigator.clipboard.writeText(urlOutput.value).then(() => {
                showToast('URL复制成功！');
            }).catch(() => {
                // 降级方案
                urlOutput.select();
                document.execCommand('copy');
                showToast('URL复制成功！');
            });
        } else {
            urlOutput.select();
            document.execCommand('copy');
            showToast('URL复制成功！');
        }
    });
    
    // 重置功能
    resetBtn.addEventListener('click', () => {
        fileInput.value = '';
        previewSection.style.display = 'none';
        urlSection.style.display = 'none';
        urlOutput.value = '';
        previewImg.src = '';
        showToast('已重置！');
    });
    
    // 显示提示框
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }
});