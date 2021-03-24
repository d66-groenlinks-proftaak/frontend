import {CellMeasurer, CellMeasurerCache, List} from "react-virtualized";

function Thread(props) {

    const _items = [
        "Test1",
        "Test",
        "Test3"
    ]

    const _cache = new CellMeasurerCache({
        fixedWidth:true
    })

    const _rowRenderer = ({index, key, parent, style}) => {
        return (
            <CellMeasurer
                cache={_cache}
                columnIndex={0}
                ></CellMeasurer>
        )
    }

    return <List
        deferredMeasurementCache={_cache}
        height={400}
        overscanRowCount={0}
        width={props.width}
        rowCount={_items.length}
        rowHeight={_cache.rowHeight}
        rowRender={_rowRenderer}
    />
}

export default Thread;
