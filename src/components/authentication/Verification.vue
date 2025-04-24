<template>
  <IonPage>
    <IonContent>
      <p class="ion-text-center italic">You are not authenticated!</p>
      <h3 class="">Please enter your key.</h3>

      <IonGrid>
        <IonRow>
          <IonCol size="3">
            <div>yes</div>
          </IonCol>
          <IonCol size="3">
            <div>yes</div>
          </IonCol>
          <IonCol size="3">
            <div>yes</div>
          </IonCol>
          <IonCol size="3">
            <div>yes</div>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/vue'
</script>
