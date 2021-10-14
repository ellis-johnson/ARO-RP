import { Component } from "react"
import { Stack, Text, mergeStyleSets, IColumn, IDetailsListStyles, TextField, DetailsList, SelectionMode, DetailsListLayoutMode, StackItem, } from '@fluentui/react';
import { Condition, INode, Taint } from "./NodesWrapper";

interface NodesComponentProps {
    nodes: any
    clusterName: string
}

const fieldStyles = {
    root: {
      paddingBottom: 20,
    },
  }

const classNames = mergeStyleSets({
    controlWrapper: {
        display: "flex",
        flexWrap: "wrap",
    },
    fullWidth: {
        width: "100%",
    },
    fileIconImg: {
        verticalAlign: "middle",
        maxHeight: "20px",
        maxWidth: "20px",
    },
    headerIcon: {
        height: 18,
        paddingTop: 1,
    },
    iconContainer: {
        margin: "-11px 0px",
        height: 42,
    },
    controlButtonContainer: {
        paddingLeft: 0,
    },
    titleText: {
        fontWeight: 600,
        fontSize: 24,
        lineHeight: 32,
    },
    subtitleText: {
        color: "#646464",
        fontSize: 12,
        lineHeight: 14,
        margin: 0,
    },
    itemsCount: {
        padding: "10px 0px",
    },
})

interface INodesState {
columns: IColumn[]
nodes: INode[]
}

const nodeListStyles: Partial<IDetailsListStyles> = {
    headerWrapper: {
        marginTop: "-16px",
    },
}

const renderConditions = (conditions: Condition[]) => {
    return conditions.map(condition => {
      return <StackItem> 
                <Stack styles={fieldStyles}>
                    <StackItem><Text variant="large">{condition.type}</Text></StackItem>
                    <Stack>
                        <StackItem><Text variant="mediumPlus">Status</Text></StackItem>
                        <StackItem>{condition.status}</StackItem>
                    </Stack>
                    <Stack>
                        <StackItem><Text variant="mediumPlus">Last Heartbeat</Text></StackItem>
                        <StackItem><Text>{condition.lastHeartbeatTime}</Text></StackItem>
                    </Stack>
                    <Stack>
                        <StackItem><Text variant="mediumPlus">Last Transition</Text></StackItem>
                        <StackItem>{condition.lastTransitionTime}</StackItem>
                    </Stack>
                    <Stack>
                        <StackItem><Text variant="mediumPlus">Message</Text></StackItem>
                        <StackItem>{condition.message}</StackItem>
                    </Stack>
                </Stack>
             </StackItem>;
    });
  };

  const renderTaints = (taints: Taint[]) => {
    return taints.map(taint => {
      return <StackItem>
                <Stack styles={fieldStyles}>
                    <StackItem><Text variant="large">{taint.key}</Text></StackItem>
                    <StackItem>{taint.effect}</StackItem>
                </Stack>
             </StackItem>;
    });
  };
export class NodesComponent extends Component<NodesComponentProps, INodesState> {

    constructor(props: NodesComponentProps) {
        super(props)

        const columns: IColumn[] = [
        {
            key: "name",
            name: "Name",
            fieldName: "name",
            minWidth: 100,
            maxWidth: 200,
            flexGrow: 10,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: "Sorted A to Z",
            sortDescendingAriaLabel: "Sorted Z to A",
            onColumnClick: this._onColumnClick,
            data: "string",
            isPadded: true,
        },
        {
            key: "createdTime",
            name: "Created Time",
            fieldName: "createdTime",
            minWidth: 80,
            maxWidth: 300,
            flexGrow: 10,
            isRowHeader: true,
            isResizable: true,
            isSorted: true,
            isSortedDescending: false,
            sortAscendingAriaLabel: "Sorted A to Z",
            sortDescendingAriaLabel: "Sorted Z to A",
            onColumnClick: this._onColumnClick,
            data: "string",
            isPadded: true,
        },
        {
            key: "resources",
            name: "Resources",
            fieldName: "resources",
            minWidth: 100,
            flexGrow: 2,
            isRowHeader: true,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            onRender: (node: INode) => (
                <Stack>
                    <StackItem><Text variant="large">CPU</Text></StackItem>
                    <Stack styles={fieldStyles}>
                        <StackItem>Capacity: {node.resources.cpu.capacity}</StackItem>
                        <StackItem>Allocated: {node.resources.cpu.allocatable}</StackItem>
                    </Stack>
                    <StackItem><Text variant="large">Memory</Text></StackItem>
                    <Stack styles={fieldStyles}>
                        <StackItem>Capacity: {node.resources.memory.capacity}</StackItem>
                        <StackItem>Allocated: {node.resources.memory.allocatable}</StackItem>
                    </Stack>
                    <StackItem><Text variant="large">Storage Volume</Text></StackItem>
                    <Stack styles={fieldStyles}>
                        <StackItem>Capacity: {node.resources.storageVolume.capacity}</StackItem>
                        <StackItem>Allocated: {node.resources.storageVolume.allocatable}</StackItem>
                    </Stack>
                    <StackItem><Text variant="large">Pods</Text></StackItem>
                    <Stack styles={fieldStyles}>
                        <StackItem>Capacity: {node.resources.pods.capacity}</StackItem>
                        <StackItem>Allocated: {node.resources.pods.allocatable}</StackItem>
                    </Stack>
                </Stack>
            ),
            data: "string",
            isPadded: true,
        },
        {
            key: "conditions",
            name: "Conditions",
            fieldName: "conditions",
            minWidth: 100,
            flexGrow: 2,
            isRowHeader: true,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            onRender: (node: INode) => (
                <Stack>
                    {renderConditions(node.conditions!)}
                </Stack>
            ),
            data: "string",
            isPadded: true,
        },
        {
            key: "taints",
            name: "Taints",
            fieldName: "taints",
            minWidth: 100,
            flexGrow: 2,
            isRowHeader: true,
            isResizable: true,
            onColumnClick: this._onColumnClick,
            onRender: (node: INode) => (
                <Stack>
                    {renderTaints(node.taints!)}
                </Stack>
            ),
            data: "string",
            isPadded: true,
        },
        ]

        this.state = {
            nodes: this.props.nodes,
            columns: columns
        }
    }

    public render() {
        var { columns, nodes } = this.state
        var myStyle = nodeListStyles

        // if ( !this.props.showColumns ) {
        // columns = [columns[0], columns[1]]
        // myStyle = clusterListDetailStylesSmall
        // }

        return (
        <Stack>
            <Text variant="xxLarge">{this.props.clusterName}</Text>
            <div className={classNames.controlWrapper}>
            <TextField placeholder="Filter on any field" onChange={this._onChangeText} />
            </div>
            <Text className={classNames.itemsCount}>Showing {nodes.length} items</Text>
            <DetailsList
            items={nodes}
            columns={columns}
            selectionMode={SelectionMode.none}
            getKey={this._getKey}
            setKey="none"
            layoutMode={DetailsListLayoutMode.fixedColumns}
            isHeaderVisible={true}
            styles={myStyle}
            />
        </Stack>
        )
    }

    private _getKey(item: any, _index?: number): string {
        return item.key
    }

    private _onChangeText = (
        _ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        text?: string
    ): void => {
        this.setState({
        nodes: text
            ? this.props.nodes.filter((i: { name: string; }) => i.name.toLowerCase().indexOf(text) > -1)
            : this.props.nodes,
        })
    }

    private _onColumnClick = (_ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
        const { columns, nodes } = this.state
        const newColumns: IColumn[] = columns.slice()
        const currColumn: IColumn = newColumns.filter((currCol) => column.key === currCol.key)[0]
        newColumns.forEach((newCol: IColumn) => {
        if (newCol === currColumn) {
            currColumn.isSortedDescending = !currColumn.isSortedDescending
            currColumn.isSorted = true
        } else {
            newCol.isSorted = false
            newCol.isSortedDescending = true
        }
        })
        this.setState({
        columns: newColumns,
        nodes: nodes,
        })
    }
}