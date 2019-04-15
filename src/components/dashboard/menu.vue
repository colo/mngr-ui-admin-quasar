<template>
  <q-drawer
    v-model="drawer"
    side="right"
    content-class="bg-secondary"
    class="gt-sm"
    :width="280"
  >
  <q-card
    :dark="$store.state.app.theme.current === 'slate'"
    square
    flat
    class="bg-secondary"
  >
    <q-tabs
      v-model="tab"
      dense
      align="justify"
      indicator-color="negative"
      narrow-indicator
    >
      <q-tab name="charts" label="Charts" />
      <q-tab name="settings" label="Settings" />

    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="tab"
      animated
      class="bg-secondary"
      :dark="$store.state.app.theme.current === 'slate'"
    >
      <q-tab-panel name="charts" :dark="$store.state.app.theme.current === 'slate'">
        <!-- <div class="text-h6">Mails</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. -->
        <q-list :dark="$store.state.app.theme.current === 'slate'" class="bg-secondary q-pa-none q-ma-none">
          <q-expansion-item
            dense-toggle
            dense
            group="somegroup"
            icon="mail"
            label="Inbox"
            default-opened
            :header-inset-level="0"
            :content-inset-level="0.1"
            class="bg-secondary"
          >
          <!-- expand-separator -->
          <!-- caption="5 unread emails" -->

            <q-card class="bg-secondary">
              <q-card-section>
                Today
              </q-card-section>
            </q-card>
            <!-- <q-expansion-item
              :header-inset-level="0.1"
              :content-inset-level="0.2"
              expand-separator
              icon="receipt"
              label="Receipts"
              default-opened
            >

              <q-expansion-item
                switch-toggle-side
                dense-toggle
                label="Today"
                :header-inset-level="0.1"
                :content-inset-level="0.1"
              >
                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet
                  </q-card-section>
                </q-card>
              </q-expansion-item>

              <q-expansion-item
                switch-toggle-side
                dense-toggle
                label="Yesterday"
                :header-inset-level="0.1"
                :content-inset-level="0.1"
              >
                <q-card>
                  <q-card-section>
                    Lorem ipsum dolor sit amet
                  </q-card-section>
                </q-card>
              </q-expansion-item>

            </q-expansion-item>

            <q-expansion-item
              :header-inset-level="0.1"
              :content-inset-level="0.1"
              expand-separator
              icon="schedule"
              label="Postponed"
            >
              <q-card>
                <q-card-section>
                  Lorem ipsum dolor sit amet
                </q-card-section>
              </q-card>
            </q-expansion-item> -->

          </q-expansion-item>

          <q-expansion-item
            dense-toggle
            dense
            group="somegroup"
            icon="mail"
            label="Inbox"
            :header-inset-level="0"
            :content-inset-level="0.1"
          >
          <!-- expand-separator -->
          <!-- caption="5 unread emails" -->

            <q-card class="bg-secondary">
              <q-card-section>
                Today
              </q-card-section>
            </q-card>

          </q-expansion-item>

        </q-list>

      </q-tab-panel>

      <q-tab-panel name="settings" :dark="$store.state.app.theme.current === 'slate'">
        <q-list :dark="$store.state.app.theme.current === 'slate'">
          <q-item-label header>User Controls</q-item-label>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Content filtering</q-item-label>
              <q-item-label caption>
                Set the content filtering level to restrict
                apps that can be downloaded
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section>
              <q-item-label>Password</q-item-label>
              <q-item-label caption>
                Require password for purchase or use
                password to restrict purchase
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <q-item-label header class="text-white">General</q-item-label>

          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox v-model="check1" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Notifications</q-item-label>
              <q-item-label caption>
                Notify me about updates to apps or games that I downloaded
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox v-model="check2" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Sound</q-item-label>
              <q-item-label caption>
                Auto-update apps at anytime. Data charges may apply
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section side top>
              <q-checkbox v-model="check3" />
            </q-item-section>

            <q-item-section>
              <q-item-label>Auto-add widgets</q-item-label>
              <q-item-label caption>
                Automatically add home screen widgets
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-separator spaced />
          <!-- <q-item-label header class="text-white">Notifications</q-item-label>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Battery too low</q-item-label>
            </q-item-section>
            <q-item-section side >
              <q-toggle color="blue" v-model="notif1" val="battery" />
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Friend request</q-item-label>
              <q-item-label caption class="text-grey-6">Allow notification</q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-toggle color="green" v-model="notif2" val="friend" />
            </q-item-section>
          </q-item>

          <q-item tag="label" v-ripple>
            <q-item-section>
              <q-item-label>Picture uploaded</q-item-label>
              <q-item-label
                caption
                class="text-grey-6"
              >
                Allow notification when uploading images
              </q-item-label>
            </q-item-section>
            <q-item-section side top>
              <q-toggle color="red" v-model="notif3" val="picture" />
            </q-item-section>
          </q-item>

          <q-separator spaced /> -->
          <q-item-label header class="text-white">Other settings</q-item-label>

          <q-item>
            <q-item-section side>
              <q-icon color="teal" name="volume_down" />
            </q-item-section>
            <q-item-section>
              <q-slider
                v-model="volume"
                :min="0"
                :max="10"
                label
                color="teal"
              />
            </q-item-section>
            <q-item-section side>
              <q-icon  color="teal" name="volume_up" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section side>
              <q-icon color="deep-orange" name="brightness_medium" />
            </q-item-section>
            <q-item-section>
              <q-slider
                v-model="brightness"
                :min="0"
                :max="10"
                label
                color="deep-orange"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section side>
              <q-icon color="primary" name="mic" />
            </q-item-section>
            <q-item-section>
              <q-slider
                v-model="mic"
                :min="0"
                :max="50"
                label
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

    </q-tab-panels>
  </q-card>

  </q-drawer>
</template>

<script>
export default {
  name: 'dashboard-menu',

  data () {
    return {

      drawer: true,
      tab: 'charts',

      check1: true,
      check2: false,
      check3: false,

      notif1: true,
      notif2: true,
      notif3: false,

      volume: 6,
      brightness: 3,
      mic: 8
    }
  }
}
</script>
