<template>
  <IonModal
    ref="modal"
    :trigger="`open-${tagContext}-modal`"
    :initial-breakpoint="0.25"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
    :expand-to-scroll="false"
    @did-dismiss="onDidDismiss()"
  >
    <IonContent class="ion-padding">
      <!-- Searchbar -->
      <IonSearchbar v-model="search" placeholder="Search..." @click="modal?.$el.setCurrentBreakpoint(0.75)"></IonSearchbar>

      <!-- And/Or Toggle -->
      <div v-if="isAnd?.show" class="flex justify-center">
        <IonToggle v-model="isAnd.ref" @ion-change="changed = true">
          Filter Logic: <strong>{{ isAnd.ref ? 'AND' : 'OR' }}</strong>
        </IonToggle>
      </div>

      <!-- Badge Buttons -->
      <div v-if="selected.length > 0" class="ms-4 pt-2">
        <IonButton v-if="typeof selected === 'string'" size="small" shape="round" class="me-1" @click="handleSingleSelected('')">
          {{ selected }}
          <IonIcon slot="end" :icon="closeOutline" class="ms-1"></IonIcon>
        </IonButton>

        <IonButton
          v-else
          v-for="(item, index) in selected"
          :key="index"
          size="small"
          shape="round"
          class="me-1"
          @click="handleMultipleSelected(false, item)"
        >
          {{ item }}
          <IonIcon slot="end" :icon="closeOutline" class="ms-1"></IonIcon>
        </IonButton>
      </div>

      <!-- Feedback -->
      <FeedbackComponent v-if="feedback.message" :is-valid="feedback.isValid" :message="feedback.message" />

      <!-- Add -->
      <div v-else-if="filtered.length === 0 && !static" class="mt-3 flex flex-col items-center justify-center gap-2">
        <div>Nothing found.</div>
        <IonButton @click="add(search)">Add {{ search }}</IonButton>
      </div>

      <!-- List Multiple -->
      <IonList v-if="multiple">
        <IonItem v-for="(f, index) in filtered" :key="index">
          <IonCheckbox
            @ionChange="handleMultipleSelected($event.detail.checked, f)"
            :checked="selected.includes(f)"
            label-placement="end"
            justify="start"
            >{{ f }}</IonCheckbox
          >
        </IonItem>
      </IonList>

      <!-- List Single -->
      <IonList v-else>
        <IonItem v-for="(f, index) in filtered" :key="index" :button="true" @click="handleSingleSelected(f)">{{ f }} </IonItem>
      </IonList>
    </IonContent>
  </IonModal>
</template>

<script setup lang="ts">
/* Import */
import { ApiTagContext, Feedback, GetConfigs, IsAnd, PostConfigs } from '@/types'
import { apiRequestGet, apiRequestPost } from '@/utils/apiRequest'
import { setFeedback, vueComputedEmit } from '@/utils/functions'
import { IonButton, IonCheckbox, IonContent, IonIcon, IonItem, IonList, IonModal, IonSearchbar, IonToggle } from '@ionic/vue'
import { closeOutline } from 'ionicons/icons'
import { computed, onMounted, ref } from 'vue'
import FeedbackComponent from './FeedbackComponent.vue'

/* Props */
const props = defineProps<{
  tagContext: string // TagContext removed because of filter
  apiTagContext: ApiTagContext
  selected: string | string[]
  multiple: boolean
  static: boolean
  staticFetch?: () => string[]
  isAnd?: IsAnd
  modalOnClose?: () => void
}>()

/* Emit */
const emit = defineEmits(['update:selected', 'update:isAnd'])
const selected = vueComputedEmit(emit, props, 'selected')
const isAnd = vueComputedEmit(emit, props, 'isAnd')

/* Ref */
const all = ref<string[]>([])
const changed = ref<boolean>(false)
const modal = ref<InstanceType<typeof IonModal>>()
const search = ref<string>('')
const feedback = ref<Feedback>({ isValid: false, message: null })

/* Computed */
const filtered = computed(() => all.value.filter((name) => name.toLowerCase().includes(search.value.toLowerCase())))

/* Mounted Lifecycle Hook */
onMounted(() => {
  fetch()
})

/* API Calls */
async function fetch(): Promise<void> {
  // If static then use staticFetch(), if not then call api
  if (props.static && props.staticFetch) {
    all.value = props.staticFetch()
  } else {
    const configs: GetConfigs = {
      url: `auth/tag/${props.apiTagContext}/get`,

      onSuccess: (result: string[]) => {
        all.value = result
        setFeedback(feedback, null)
      },

      onFail: (error: Error) => setFeedback(feedback, error.message),
    }

    await apiRequestGet(configs)
  }
}

async function add(person: string): Promise<void> {
  const configs: PostConfigs = {
    url: `auth/tag/${props.apiTagContext}/add`,

    body: () => JSON.stringify({ name: person }),

    onSuccess: () => fetch(),

    onFail: (error: Error) => {
      setFeedback(feedback, error.message)
      setTimeout(() => setFeedback(feedback, null), 2000)
    },
  }

  await apiRequestPost(configs)
}

/* Utility Functions */
function handleMultipleSelected(checked: boolean, value: string): void {
  // If checked: push value | if unchecked: splice value
  checked ? selected.value.push(value) : selected.value.splice(selected.value.indexOf(value), 1)
  changed.value = true
}

function handleSingleSelected(value: string): void {
  selected.value = value
  changed.value = true
}

function onDidDismiss(): void {
  if (changed.value) {
    props.modalOnClose?.()
    changed.value = false
  }
}
</script>
