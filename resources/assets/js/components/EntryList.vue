
<template>
    <div>
        <b-modal v-model="showDiscardModal" @cancel="closeAction">
            <div class="w-100">
                Discard unsaved changes?
            </div>
            <div slot="modal-footer">
                <button class="btn btn-secondary"
                        @click.stop="closeAction">
                    Discard changes
                </button>
                <button class="btn btn-primary"
                        @click.stop="savePreviousEntry">
                    Save changes
                </button>
            </div>
        </b-modal>
        <b-modal v-model="showDeleteModal" @cancel="closeDeleteAction">
            <div class="w-100">
                Delete entry?
            </div>
            <div slot="modal-footer">
                <button class="btn btn-primary"
                        @click.stop="closeDeleteAction">
                    Cancel
                </button>
                <button class="btn btn-secondary"
                        @click.stop="deleteEntry">
                    Delete
                </button>
            </div>
        </b-modal>
        <div>
            Marppa Larppa Budget App
        </div>
        <div>
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Date</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(entry, entryIndex) in entries"
                        @click="updateModifyId(entry.id)"
                        :key="entry.id">
                        <td>
                            <input v-if="isModifiedRow(entry.id)" 
                                   v-model="modifiedEntry.name"
                                   type="text">
                            <span  v-if="!isModifiedRow(entry.id)">
                                {{ entry.name }}
                            </span>
                        </td>
                        <td>
                            <input v-if="isModifiedRow(entry.id)" 
                                   v-model="modifiedEntry.description"
                                   type="text">
                            <span  v-if="!isModifiedRow(entry.id)">
                                {{ entry.description }}
                            </span>
                        </td>
                        <td>
                            <input v-if="isModifiedRow(entry.id)" 
                                   v-model="modifiedEntry.category"
                                   type="text">
                            <span  v-if="!isModifiedRow(entry.id)">
                                {{ entry.category }}
                            </span>
                        </td>
                        <td>
                            <input v-if="isModifiedRow(entry.id)" 
                                   v-model="modifiedEntry.price"
                                   type="text">
                            <span  v-if="!isModifiedRow(entry.id)">
                                {{ entry.price }}
                            </span>
                        </td>
                        <td>
                            {{ entry.date }}
                        </td>
                        <td>
                            <button class="btn btn-danger"
                                    @click.stop="openDeleteModal(entry.id)">
                                Delete
                            </button>
                            <button class="btn btn-outline-primary"
                                    v-show="isModifiedRow(entry.id) && modifiedIsDirty"
                                    @click.stop="updateEntry">
                                Update
                            </button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input type="text" v-model="newEntry.name">
                        </td>
                        <td>
                            <input type="text" v-model="newEntry.description">
                        </td>
                        <td>
                            <input type="text" v-model="newEntry.category">
                        </td>
                        <td>
                            <input type="text" v-model="newEntry.price">
                        </td>
                        <td>
                            {{ newEntry.date }}
                        </td>
                        <td>
                            <button class="btn btn-success"
                                    @click="addEntry">
                                Add entry
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style>
</style>

<script>
    import _ from 'lodash'
    const date = new Date()

    export default {
        data () {
            return {
                entries: [],
                previousEntry: null,
                previousId: -1,
                newEntry: {
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                },
                modifiedEntry: {
                    name: '',
                    description: '',
                    category: '',
                    price: '',
                    date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
                },
                modifyId: -1,
                showDiscardModal: false,
                showDeleteModal: false,
            }
        },
        computed: {
            isModifiedRow () {
                return id => this.modifyId === id
            },
            modifiedOriginalEntry () {
                let entry = null
                if (this.modifyId !== -1) {
                    entry = _.find(this.entries, x => {
                        return x.id === this.modifyId
                    })
                }
                return entry
            },
            modifiedIsDirty () {
                let res = false
                if (!_.isNil(this.modifiedOriginalEntry)) {
                    res = this.isDirty(this.modifiedEntry, this.modifiedOriginalEntry)
                }
                return res
            },
        },
        mounted () {
            this.fetchEntries()
        },
        methods: {
            fetchEntries () {
                this.axios
                    .get('/entries')
                    .then(res => {
                        this.entries = res.data
                    })
            },
            addEntry () {
                const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                this.axios
                    .post('/entries', this.newEntry)
                    .then(res => {
                        this.entries.push(res.data)
                        this.newEntry.name = ''
                        this.newEntry.description = ''
                        this.newEntry.category = ''
                        this.newEntry.price = ''
                        this.newEntry.date = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    })
            },
            deleteEntry () {
                let url = `/entries/${this.deleteId}`
                this.axios
                    .delete(url)
                    .then(res => {
                        const mutated = _.remove(this.entries, x => {
                            return x.id !== res.data.id
                        }) 
                        this.entries = mutated
                        this.closeDeleteAction()
                    })
            },
            updateEntry (e, savePrevious = false) {
                const id = savePrevious ? this.previousId : this.modifyId
                const entry = savePrevious ? this.previousEntry : this.modifiedEntry
                this.previousEntry = null
                let url = `/entries/${id}`
                this.axios
                    .patch(url, entry)
                    .then(res => {
                        const mutated = _(this.entries)
                            .map(x => {
                                if (x.id === res.data.id) {
                                    x = res.data
                                }
                                return x
                            }).value()
                        this.entries = mutated
                    })
            },
            closeAction () {
                this.showDiscardModal = false
            },
            savePreviousEntry () {
                this.updateEntry(null, true)
                this.closeAction(this.modifyId)
            },
            openDeleteModal (id) {
                this.deleteId = id
                this.showDeleteModal = true
            },
            closeDeleteAction () {
                this.showDeleteModal = false
            },
            updateModifyId (id) {
                if (this.modifyId !== -1 && this.modifyId !== id) {
                    const oldEntry = _.find(_.cloneDeep(this.entries), x => {
                        return x.id === this.modifyId
                    })
                    const newEntry = this.modifiedEntry
                    let isDirty = false
                    if (!_.isNil(newEntry) && !_.isNil(oldEntry)) {
                        isDirty = this.isDirty(newEntry, oldEntry)
                    }
                    if (isDirty) {
                        this.previousId = this.modifyId
                        this.previousEntry = newEntry
                        this.showDiscardModal = true
                    }

                    this.modifyId = id
                    this.modifiedEntry = _.find(_.cloneDeep(this.entries), x => {
                        return x.id === id
                    })
                } else if (this.modifyId === -1) {
                    this.modifyId = id
                    this.modifiedEntry = _.find(_.cloneDeep(this.entries), x => {
                        return x.id === id
                    })
                }
            },
            isDirty (entry, other) {
                const res = entry.name !== other.name
                            || entry.description !== other.description
                            || entry.category !== other.category
                            || entry.price !== other.price
                            || entry.date !== other.date
                            || entry.id !== other.id
                return res
            },
        },
    }
</script>