
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
            <div>
                {{ categories }}
            </div>
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
                    <tr v-for="entry in entries"
                        @click="updateModifyId(entry.id)"
                        :key="entry.id">
                        <td>
                            <div v-if="isModifiedRow(entry.id)">
                                <input class="form-control" 
                                    :class="{ 'is-invalid': $v.modifiedEntry.name.$invalid }"
                                    v-model="modifiedEntry.name"
                                    type="text">
                                <error-message v-if="$v.modifiedEntry.name.$invalid"
                                               :validations="$v.modifiedEntry.name">
                                </error-message>
                            </div>
                            <span v-if="!isModifiedRow(entry.id)">
                                {{ entry.name }}
                            </span>
                        </td>
                        <td>
                            <div v-if="isModifiedRow(entry.id)">
                                <input class="form-control" 
                                    :class="{ 'is-invalid': $v.modifiedEntry.description.$invalid }"
                                    v-model="modifiedEntry.description"
                                    type="text">
                                <error-message v-if="$v.modifiedEntry.description.$invalid"
                                            :validations="$v.modifiedEntry.description">
                                </error-message>
                            </div>
                            <span v-if="!isModifiedRow(entry.id)">
                                {{ entry.description }}
                            </span>
                        </td>
                        <td>
                            <div v-if="isModifiedRow(entry.id)">
                                <multiselect v-model="modifiedEntry.category"
                                            :taggable="true"
                                            :custom-label="categoryLabel"
                                            tag-placeholder="Add this new category"
                                            @tag="addCategory"
                                            :class="{ 'is-invalid': $v.modifiedEntry.category.$invalid }"
                                            :options="categories">
                                </multiselect>
                                <error-message v-if="$v.modifiedEntry.category.$invalid"
                                            :validations="$v.modifiedEntry.category">
                                </error-message>
                            </div>
                            <span v-if="!isModifiedRow(entry.id)">
                                {{ entry.category }}
                            </span>
                        </td>
                        <td>
                            <div v-if="isModifiedRow(entry.id)">
                                <input class="form-control"
                                    :class="{ 'is-invalid': $v.modifiedEntry.price.$invalid }"
                                    v-model="modifiedEntry.price"
                                    type="text">
                                <error-message v-if="$v.modifiedEntry.price.$invalid"
                                            :validations="$v.modifiedEntry.price">
                                </error-message>
                            </div>
                            <span v-if="!isModifiedRow(entry.id)">
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
                            <div id="modified-entry-button">
                                <button class="btn btn-outline-primary"
                                        v-show="isModifiedRow(entry.id) && modifiedIsDirty"
                                        :disabled="$v.modifiedEntry.$error || $v.modifiedEntry.$invalid"
                                        @click.stop="updateEntry">
                                    Update
                                </button>
                                <b-popover 
                                    :target="'modified-entry-button'"
                                    :disabled="disablePopoverModifiedEntry"
                                    triggers="hover focus">
                                    <template slot="title">
                                        Following fields have errors:
                                    </template>
                                    {{ modifiedEntryErrorFields }}
                                </b-popover>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <input class="form-control" 
                                   :class="{ 'is-invalid': $v.newEntry.name.$error }"
                                   type="text" 
                                   @input="$v.newEntry.name.$touch()"
                                   v-model="newEntry.name">
                            <error-message v-if="$v.newEntry.name.$error"
                                           :validations="$v.newEntry.name">
                            </error-message>
                        </td>
                        <td>
                            <input class="form-control" 
                                   :class="{ 'is-invalid': $v.newEntry.description.$error }"
                                   type="text" 
                                   @input="$v.newEntry.description.$touch()"
                                   v-model="newEntry.description">
                            <error-message v-if="$v.newEntry.description.$error"
                                           :validations="$v.newEntry.description">
                            </error-message>
                        </td>
                        <td>
                            <multiselect v-model="newEntry.category"
                                        :taggable="true"
                                        :custom-label="categoryLabel"
                                        tag-placeholder="Add this new category"
                                        @tag="addCategory"
                                        :class="{ 'is-invalid': $v.newEntry.category.$invalid }"
                                        :options="categories">
                            </multiselect>
                            <error-message v-if="$v.newEntry.category.$error"
                                           :validations="$v.newEntry.category">
                            </error-message>
                        </td>
                        <td>
                            <input class="form-control" 
                                   :class="{ 'is-invalid': $v.newEntry.price.$error }"
                                   type="text" 
                                   @input="$v.newEntry.price.$touch()"
                                   v-model="newEntry.price">
                            <error-message v-if="$v.newEntry.price.$error"
                                           :validations="$v.newEntry.price">
                            </error-message>
                        </td>
                        <td>
                            {{ newEntry.date }}
                        </td>
                        <td id="new-entry-button">
                            <button class="btn btn-success"
                                    :disabled="$v.newEntry.$error || $v.newEntry.$invalid"
                                    @click="addEntry">
                                <b-popover 
                                    :target="'new-entry-button'"
                                    :disabled="disablePopoverNewEntry"
                                    triggers="hover focus">
                                    <template slot="title">
                                        Following fields have errors:
                                    </template>
                                    {{ newEntryErrorFields }}
                                </b-popover>
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
    import { 
        required, 
        minLength, 
        maxLength,
        between, 
        numeric,
    } from 'vuelidate/lib/validators'
    import * as helpers from '../helpers/entryHelpers'

    const date = new Date()
    const validations = {
        name: {
            required,
            minLength: minLength(3),
            maxLength: maxLength(20),
        },
        description: {
            required,
            maxLength: maxLength(50),
        },
        category: {
            required,
            maxLength: maxLength(20),
        },
        price: {
            required,
            numeric,
        },
    }

    export default {
        data () {
            return {
                entries: [],
                categories: [],
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
        validations: {
            newEntry: _.cloneDeep(validations), 
            modifiedEntry: _.cloneDeep(validations), 
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
            newEntryErrorFields () {
                let errorText = ''
                _(this.$v.newEntry)
                    .forOwn((x, key) => {
                        if (x.$error || x.$invalid) {
                            errorText += `${key}, `
                        }
                    })
                return errorText
            },
            modifiedEntryErrorFields () {
                let errorText = ''
                _(this.$v.modifiedEntry)
                    .forOwn((x, key) => {
                        if (x.$error || x.$invalid) {
                            errorText += `${key}, `
                        }
                    })
                return errorText
            },
            disablePopoverNewEntry () {
                return !this.$v.newEntry.$error && !this.$v.newEntry.$invalid
            },
            disablePopoverModifiedEntry () {
                return !this.$v.modifiedEntry.$error && !this.$v.modifiedEntry.$invalid
            },
        },
        mounted () {
            this.fetchEntries()
            this.fetchCategories()
        },
        methods: {
            addCategory (newCategory) {
                this.axios
                    .post('/categories', {
                        category: newCategory,
                    })
                    .then(res => {
                        this.categories.push(res.data)
                    })
            },
            categoryLabel ({ category }) {
                return category
            },
            fetchEntries () {
                this.axios
                    .get('/entries')
                    .then(res => {
                        this.entries = res.data
                    })
            },
            fetchCategories () {
                this.axios
                    .get('/categories')
                    .then(res => {
                        this.categories = res.data
                    })
            },
            addEntry () {
                const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                const postBody = _.cloneDeep(this.newEntry)
                postBody.category = postBody.category.category
                this.axios
                    .post('/entries', postBody)
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

                const postBody = _.cloneDeep(entry)
                postBody.category = postBody.category.category
                this.axios
                    .patch(url, postBody)
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
                            || entry.category.category !== other.category
                            || entry.price !== other.price
                            || entry.date !== other.date
                            || entry.id !== other.id
                return res
            },
        },
    }
</script>