<template>
  <IonModal
    ref="modal"
    :trigger="`open-${tagContext}-modal`"
    :initial-breakpoint="0.25"
    :breakpoints="[0, 0.25, 0.5, 0.75]"
    :expand-to-scroll="false"
  >
    <IonContent class="ion-padding">
      <!-- Searchbar -->
      <IonSearchbar v-model="search" placeholder="Search..." @click="modal?.$el.setCurrentBreakpoint(0.75)"></IonSearchbar>

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
            @ionChange="handleMultipleSelected($event, f)"
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
import { ApiTagContext, Feedback, GetConfigs, PostConfigs, TagContext } from '@/types'
import { apiRequestGet, apiRequestPost } from '@/utils/apiRequest'
import { setFeedback, vueComputedEmit } from '@/utils/functions'
import { IonButton, IonCheckbox, IonContent, IonItem, IonList, IonModal, IonSearchbar } from '@ionic/vue'
import { computed, onMounted, ref } from 'vue'
import FeedbackComponent from './FeedbackComponent.vue'

/* Props */
const props = defineProps<{
  tagContext: TagContext
  apiTagContext: ApiTagContext
  selected: string | string[]
  multiple: boolean
  static: boolean
  staticFetch?: () => string[]
}>()

/* Emit */
const emit = defineEmits(['update:selected'])
const selected = vueComputedEmit(emit, props, 'selected')

/* Ref */
const all = ref<string[]>([])
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
      url: `tag/${props.apiTagContext}/get`,

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
    url: `tag/${props.apiTagContext}/add`,

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
function handleMultipleSelected(event: CustomEvent, value: string): void {
  // If checked: push value | if unchecked: splice value
  event.detail.checked ? selected.value.push(value) : selected.value.splice(selected.value.indexOf(value), 1)
}

function handleSingleSelected(value: string): void {
  selected.value = value
}
</script>
