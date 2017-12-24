
<template>
    <div>
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
                            {{ entry.description }}
                        </td>
                        <td>
                            {{ entry.category }}
                        </td>
                        <td>
                            {{ entry.price }}
                        </td>
                        <td>
                            {{ entry.date }}
                        </td>
                        <td>
                            <button class="btn btn-danger"
                                    @click="deleteEntry(entry.id)">
                                Delete
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
                modifyId: 0,
            }
        },
        computed: {
            isModifiedRow () {
                return id => this.modifyId === id
            }
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
                        console.log(res)
                        this.entries.push(res.data)
                    })
            },
            deleteEntry (id) {
                let url = `/entries/${id}`
                this.axios
                    .delete(url)
                    .then(res => {
                        const mutated = _.remove(this.entries, x => {
                            return x.id !== res.data.id
                        }) 
                        this.entries = mutated
                    })
            },
            updateModifyId (id) {
                this.modifyId = id
                this.modifiedEntry = _.find(this.entries, x => {
                    return x.id === id
                })
            },
        },
    }
</script>