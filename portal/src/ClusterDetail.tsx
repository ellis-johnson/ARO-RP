import { IPanelStyles, Panel, PanelType } from '@fluentui/react/lib/Panel';
import { useBoolean } from '@fluentui/react-hooks';
import { useState, useEffect, useRef, MutableRefObject } from "react"
import { IMessageBarStyles, MessageBar, MessageBarType, Stack, Separator } from '@fluentui/react';
import { AxiosResponse } from 'axios';
import { FetchClusterInfo } from './Request';
import { IClusterDetail, contentStackStylesNormal } from "./App"
import { Nav, INavLink, INavLinkGroup, INavStyles } from '@fluentui/react/lib/Nav';
import { ClusterDetailComponent } from './ClusterDetailList'


const navStyles: Partial<INavStyles> = {
  root: {
    width: 155,
    paddingRight: "10px"
  },
  link: {
    whiteSpace: 'normal',
    lineHeight: 'inherit',
  },
  groupContent: {
    marginBottom: "0px"
  }
};

const customPanelStyle: Partial<IPanelStyles> = {
  root: { top: "40px", left: "225px" },
  content: { paddingLeft: 5, paddingRight: 5, },
}

const errorBarStyles: Partial<IMessageBarStyles> = { root: { marginBottom: 15 } }

export function ClusterDetailPanel(props: {
  csrfToken: MutableRefObject<string>
  currentCluster: IClusterDetail
  detailPanelSelected: string
  onClose: any // TODO: function ptr .. any probably bad
  loaded: string
}) {
  const [data, setData] = useState<any>([])
  const [error, setError] = useState<AxiosResponse | null>(null)
  const state = useRef<ClusterDetailComponent>(null)
  const [fetching, setFetching] = useState("")
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false); // panel controls
  const [detailPanelSelected, setPanelSelected] = useState(props.detailPanelSelected)

  const errorBar = (): any => {
    return (
      <MessageBar
        messageBarType={MessageBarType.error}
        isMultiline={false}
        onDismiss={() => setError(null)}
        dismissButtonAriaLabel="Close"
        styles={errorBarStyles}
      >
        {error?.statusText}
      </MessageBar>
    )
  }

  // updateData - updates the state of the component
  // can be used if we want a refresh button.
  // api/clusterdetail returns a single item.
  const updateData = (newData: any) => {
    setData(newData)
    if (state && state.current) {
      state.current.setState({ item: newData, detailPanelSelected: props.detailPanelSelected })
    }
  }

  const _dismissPanel = () => {
    dismissPanel()
    props.currentCluster.clusterName = ""
    props.onClose() // useEffect?
  }

  useEffect(() => {
    const onData = (result: AxiosResponse | null) => {
      if (result?.status === 200) {
        updateData(result.data)
      } else {
        setError(result)
      }
      setFetching(props.currentCluster.clusterName)
    }

    if (fetching === "" && props.loaded === "DONE" && props.currentCluster.clusterName != "") {
      setFetching("FETCHING")
      FetchClusterInfo(props.currentCluster.subscription, props.currentCluster.resource, props.currentCluster.clusterName).then(onData) // TODO: fetchClusterInfo accepts IClusterDetail
    }
  }, [data, props.currentCluster.clusterName, props.loaded])


  useEffect(() => {
    if (props.currentCluster.clusterName != "") {
      if (props.currentCluster.clusterName == fetching) {
        openPanel()
      } else {
        setData([])
        setFetching("")
        openPanel()
      }
    }
  }, [props.currentCluster.clusterName])

  useEffect(() => {
    setPanelSelected(props.detailPanelSelected)
  }, [props.detailPanelSelected, props.currentCluster])

  function _onLinkClick(ev?: React.MouseEvent<HTMLElement>, item?: INavLink) {
    if (item && item.name !== '') {
      setPanelSelected(item.name)
    }
  }

  var navLinkGroups = [
    {
      links: [
        {
          name: 'Overview',
          key: 'overview',
          url: '#' + props.currentCluster.resourceId + '/overview',
          icon: 'ThisPC',
        },
        {
          name: 'Nodes',
          key: 'nodes',
          url: '#' + props.currentCluster.resourceId + '/nodes',
          icon: 'BuildQueue',
        },
      ],
    },
  ];

  // TODO: props.loaded rename to CSRFTokenAvailable
  return (
    <Panel
      isOpen={isOpen}
      type={PanelType.custom}
      onDismiss={_dismissPanel}
      isBlocking={false}
      styles={customPanelStyle}
      closeButtonAriaLabel="Close"
    >
      <Stack styles={contentStackStylesNormal}>
        <Stack.Item grow>{error && errorBar()}</Stack.Item>
        <Stack horizontal>
          <Stack.Item>
            <Nav
              onLinkClick={_onLinkClick}
              ariaLabel="Select a tab to view"
              styles={navStyles}
              groups={navLinkGroups}
              initialSelectedKey={detailPanelSelected}
            />
          </Stack.Item>
          <Separator vertical />
          <Stack.Item grow>
            <ClusterDetailComponent
              item={data}
              clusterName={props.currentCluster.clusterName}
              detailPanelSelected={detailPanelSelected}
            />
          </Stack.Item>
        </Stack>
      </Stack>
    </Panel>
  )
}
