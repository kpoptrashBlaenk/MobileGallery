<template>
  <div class="h-1/2 ps-5 text-sm text-gray-700">
    <!-- Date -->
    <p class="mt-2 text-base font-bold text-black">
      {{ formatDate(media.uploaded_at) }}
    </p>

    <!-- Name -->
    <p class="">{{ formatMediaName(media.name) }}</p>

    <!-- Image Info -->
    <p class="mt-2 text-base font-bold text-black">Media Info</p>
    <p>
      {{ formatBytes(media.size) }} | {{ media.width }}×{{ media.height }}px |
      {{ media.type.toUpperCase() }}
    </p>

    <!-- Tags -->
    <p class="mt-2 text-base font-bold text-black">Tags</p>
    <div class="mt-1 flex gap-5">
      <p>
        <IonIcon :icon="calendar"></IonIcon>
        {{ media.season }}
      </p>
      <p>
        <IonIcon :icon="location"></IonIcon>
        {{ media.location_name }}
      </p>
    </div>

    <div v-if="media.people.length > 0" class="mt-1 flex items-center gap-1">
      <IonIcon :icon="people"></IonIcon>

      <IonBadge v-for="person in media.people" class="p-1">
        {{ person.name }}
      </IonBadge>
    </div>

    <div v-if="media.albums.length > 0" class="mt-1 flex items-center gap-1">
      <IonIcon :icon="albums"></IonIcon>

      <IonBadge v-for="album in media.albums" class="p-1">
        {{ album.name }}
      </IonBadge>
    </div>
  </div>
</template>

<script setup lang="ts">
/* Import */
import { DBMediaWithTagsAndPath } from '@/types'
import { formatMediaName } from '@/utils/functions'
import { IonBadge, IonIcon } from '@ionic/vue'
import { albums, calendar, location, people } from 'ionicons/icons'

/* Props */
defineProps<{
  media: DBMediaWithTagsAndPath
}>()

/* Utility Functions */
function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

function formatDate(date: string): string {
  const d = new Date(date)

  const weekday = d.toLocaleString('en-US', { weekday: 'long' })
  const month = d.toLocaleString('en-US', { month: 'short' })
  const day = d.getDate().toString().padStart(2, '0')
  const year = d.getFullYear()
  const hour = d.getHours().toString().padStart(2, '0')
  const minute = d.getMinutes().toString().padStart(2, '0')

  return `${weekday}, ${month} ${day} ${year} · ${hour}:${minute}`
}
</script>
