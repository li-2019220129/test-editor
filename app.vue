<template>
    <el-upload ref="uploadRef" class="upload-demo" action="#" list-type="picture-card" :auto-upload="true"
        :show-file-list="false" :http-request="dummyRequest" @change="handleChange">
        <!-- 上传按钮（没有图片时显示） -->
        <template #default>
            <el-icon v-if="!imageUrl">
                <Plus />
            </el-icon>

            <!-- 有图片时显示自定义区域（注意这是放在 default slot 里，使整块仍然可点击上传/替换） -->
            <template v-if="imageUrl">
                <div class="custom-file">
                    <img style="object-fit: cover; width: 100%; height: 100%;" class="el-upload-list__item-thumbnail"
                        :src="imageUrl" alt="" />

                    <!-- 进度遮罩 -->
                    <div v-if="uploading" class="progress-mask">
                        <el-progress type="circle" :percentage="progress" width="80" />
                    </div>

                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-preview" @click.stop="handlePictureCardPreview">
                            <el-icon>
                                <ZoomIn />
                            </el-icon>
                        </span>
                        <span class="el-upload-list__item-delete" @click.stop="handleDownload">
                            <el-icon>
                                <Download />
                            </el-icon>
                        </span>
                        <span class="el-upload-list__item-delete" @click.stop="handleRemove">
                            <el-icon>
                                <Delete />
                            </el-icon>
                        </span>
                    </span>
                </div>
            </template>
        </template>
    </el-upload>

    <el-dialog v-model="dialogVisible" width="50%">
        <img class="w-full" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue'
import type { UploadRequestOptions } from 'element-plus'

const uploadRef = ref<any>(null)

const imageUrl = ref<string | null>(null)
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const progress = ref(0)
const uploading = ref(false)

/**
 * 自定义请求：每次调用都会主动触发 options.onProgress -> 这样进度能被感知
 */
const dummyRequest = (options: UploadRequestOptions) => {
    uploading.value = true
    progress.value = 0
    let percent = 0
    // const file = options.file

    const timer = setInterval(() => {
        percent += Math.floor(Math.random() * 15) + 5 // 随机增量更自然
        if (percent > 100) percent = 100
        progress.value = percent
        // 把进度回调给 el-upload（有助于内部状态或其他监听）
        // options.onProgress?.({ percent }, file)
        if (percent >= 100) {
            clearInterval(timer)
            uploading.value = false
            // 模拟成功
            // options.onSuccess?.({ url: 'fake-url' }, file)
        }
    }, 250)

    return {
        abort() {
            clearInterval(timer)
            uploading.value = false
            // options.onError?.({ message: 'aborted' }, file)
        },
    }
}

/** 选择文件时立刻用 base64 预览（所以图片立即显示） */
const handleChange = (file: any) => {
    const raw = file?.raw
    if (!raw) return
    const reader = new FileReader()
    reader.onload = (e) => {
        imageUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(raw)
}

/** 预览 */
const handlePictureCardPreview = () => {
    dialogImageUrl.value = imageUrl.value!
    dialogVisible.value = true
}

/** 下载（直接用 dataURL 下载） */
const handleDownload = () => {
    if (!imageUrl.value) return
    const a = document.createElement('a')
    a.href = imageUrl.value
    a.download = 'image.png'
    a.click()
}

/** 删除并清理 upload 组件内部文件状态 */
const handleRemove = () => {
    imageUrl.value = null
    progress.value = 0
    uploading.value = false
    uploadRef.value?.clearFiles?.()
}
</script>

<style scoped lang="less">
.custom-file {
    position: relative;
    width: 100%;
    height: 100%;
}

.progress-mask {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
