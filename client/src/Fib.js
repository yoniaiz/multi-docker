import React, {
    Component
} from 'react';
import axios from 'axios';

class Fib extends Component {
    state = {
        seenIndexex: [],
        values: {},
        index: ''
    }

    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    async fetchValues() {
        const values = await axios.get('/api/values/current')
        this.setState({
            values: values.data
        })
    }

    async fetchIndexes() {
        const seenIndexex = await axios.get('/api/values/all')
        this.setState({
            seenIndexex: seenIndexex.data
        })
    }

    renderSeenIndexes() {
        return this.state.seenIndexex.map(({ number }) => number).join(", ")
    }

    renderValues() {
        const entries = [];

        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    for index {key} i calculated {this.state.values[key]}
                </div>
            )
        }
        return entries
    }

    handleSubmit = async (e) => {
        e.preventDefault();

        await axios.post('/api/values', {
            index: this.state.index
        })

        this.setState({ index: '' });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={(e) => this.setState({ index: e.target.value })}
                    />
                    <button>Submit</button>
                </form>

                <h3>Indexes I have seen:</h3>
                {
                    this.renderSeenIndexes()
                }
                <h3>Culculated values:</h3>
                {
                    this.renderValues()
                }
            </div>
        )
    }
}

export default Fib;