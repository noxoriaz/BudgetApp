
<template>
<tbody>
    <tr v-for="entry in entries"
        @click="updateModifyId(entry.id)"
        :key="entry.id">
        <td>
            <div v-if="showInput(entry.id)">
                <input class="form-control" 
                    :class="{ 'is-invalid': $v.activeEntry.name.$error }"
                    @input="$v.activeEntry.name.$touch()"
                    v-model="activeEntry.name"
                    type="text">
                <error-message v-if="$v.activeEntry.name.$error"
                                :validations="$v.activeEntry.name">
                </error-message>
            </div>
            <span v-if="!showInput(entry.id)">
                {{ entry.name }}
            </span>
        </td>
        <td>
            <div v-if="showInput(entry.id)">
                <input class="form-control" 
                    :class="{ 'is-invalid': $v.activeEntry.description.$error }"
                    @input="$v.activeEntry.description.$touch()"
                    v-model="activeEntry.description"
                    type="text">
                <error-message v-if="$v.activeEntry.description.$error"
                            :validations="$v.activeEntry.description">
                </error-message>
            </div>
            <span v-if="!showInput(entry.id)">
                {{ entry.description }}
            </span>
        </td>
        <td>
            <div v-if="showInput(entry.id)">
                <multiselect v-model="activeEntry.category"
                            :taggable="true"
                            :custom-label="categoryLabel"
                            tag-placeholder="Add this new category"
                            @input="$v.activeEntry.description.$touch()"
                            @tag="addCategory"
                            :class="{ 'is-invalid': $v.activeEntry.category.$error }"
                            :options="categories">
                </multiselect>
                <error-message v-if="$v.activeEntry.category.$error"
                            :validations="$v.activeEntry.category">
                </error-message>
            </div>
            <span v-if="!showInput(entry.id)">
                {{ entry.category }}
            </span>
        </td>
        <td>
            <div v-if="showInput(entry.id)">
                <input class="form-control"
                    :class="{ 'is-invalid': $v.activeEntry.price.$error }"
                    @input="$v.activeEntry.price.$touch()"
                    v-model="activeEntry.price"
                    type="text">
                <error-message v-if="$v.activeEntry.price.$error"
                            :validations="$v.activeEntry.price">
                </error-message>
            </div>
            <span v-if="!showInput(entry.id)">
                {{ entry.price }}
            </span>
        </td>
        <td>
            {{ entry.date }}
        </td>
        <td>
            <button v-if="showModifyControls" class="btn btn-danger"
                    @click.stop="openDeleteModal(entry.id)">
                Delete
            </button>
            <div id="modified-entry-button">
                <button class="btn btn-outline-primary"
                        v-show="showInput(entry.id) && isDirty"
                        :disabled="$v.activeEntry.$error || $v.activeEntry.$invalid"
                        @click.stop="triggerAction">
                    {{ actionText }}
                </button>
                <b-popover 
                    :target="'modified-entry-button'"
                    :disabled="disablePopoverActiveEntry"
                    triggers="hover focus">
                    <template slot="title">
                        Following fields have errors:
                    </template>
                    {{ activeEntryErrorFields }}
                </b-popover>
            </div>
        </td>
    </tr>
</tbody>
  
</template>

<style>
</style>


<script>
import { entryValidations as validations } from './../models/validation';

export default {
    props: {
        entries: Array,
        updateModifyId: Function,
        isModifiedRow: [Function, Boolean],
        alwaysShowInputs: {
            type: Boolean,
            default: false,
        },
        activeEntry: Object,
        categoryLabel: Function,
        openDeleteModal: Function,
        isDirty: Boolean,
        entryAction: Function,
        disablePopoverActiveEntry: Boolean,
        activeEntryErrorFields: String,
        categories: Array,
        addCategory: Function,
        showModifyControls: {
            type: Boolean,
            default: true,
        },
        actionText: String,
    },
    computed: {
        showInput () {
            if (this.alwaysShowInputs) {
                return (val) => true
            } else {
                return (val) => this.isModifiedRow(val)
            }
        }
    },
    validations: {
        activeEntry: _.cloneDeep(validations), 
    },
    methods: {
        triggerAction () {
            this.entryAction()
            this.$v.activeEntry.$reset()
        },
    },
}
</script>

