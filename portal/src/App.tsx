import { useState, useEffect, useRef, useCallback, EffectCallback } from "react"
import {
  Stack,
  Text,
  Panel,
  IStackTokens,
  IconButton,
  IStackStyles,
  DefaultPalette,
  ThemeProvider,
  PartialTheme,
  PanelType,
  IButtonStyles,
  IPanelProps,
  MessageBar,
  IRenderFunction,
  ITextStyles,
  IPanelStyles,
  TooltipHost,
  IMessageBarStyles,
  MessageBarType,
  Icon,
} from "@fluentui/react"
import { AxiosResponse } from "axios"
import { useBoolean } from "@fluentui/react-hooks"
import { SSHModal } from "./SSHModal"
import { ClusterDetailPanel } from "./ClusterDetail"
import { ClusterList } from "./ClusterList"
import { FetchInfo, ProcessLogOut } from "./Request"
import { useHistory, withRouter, BrowserRouter } from 'react-router-dom'

const containerStackTokens: IStackTokens = {}
const appStackTokens: IStackTokens = { childrenGap: 10 }

const errorBarStyles: Partial<IMessageBarStyles> = { root: { marginBottom: 15 } }

const stackStyles: IStackStyles = {
  root: [
    {
      width: "100%",
      padding: 0,
    },
  ],
}

const headerTextStyles: ITextStyles = {
  root: {
    fontWeight: 600,
  },
}

export const contentStackStylesNormal: IStackStyles = {
  root: [
    {
      padding: 20,
    },
  ],
}

const contentStackStylesSmall: IStackStyles = {
  root: [
    {
      padding: 20,
      width: "215px",
    },
  ],
}


const stackNavStyles: IStackStyles = {
  root: {
    padding: "0px 15px",
    height: 40,
  },
}

const MenuButtonStyles: IButtonStyles = {
  icon: { color: DefaultPalette.white },
}

const darkTheme: PartialTheme = {
  semanticColors: {
    bodyBackground: DefaultPalette.themePrimary,
    bodyText: DefaultPalette.white,
  },
}

const navPanelStyles: Partial<IPanelStyles> = {
  navigation: {
    height: 40,
    lineHeight: 40,
    fontSize: 15,
    paddingLeft: 15,
    justifyContent: "start",
    alignItems: "center",
  },
}

export interface IClusterDetail {
  subscription: string,
  resource: string,
  clusterName: string,
  resourceId: string
}

export const clusterRegex: RegExp = /^\/subscriptions\/(.*)\/resourceGroups\/(.*)\/providers\/Microsoft\.RedHatOpenShift\/openShiftClusters\/(.*)\/(\w+)/;

export function checkRoute(history: string) {
  return clusterRegex.exec(history);
}

function App() {
  const [data, updateData] = useState({ location: "", csrf: "", elevated: false, username: "" })
  const [error, setError] = useState<AxiosResponse | null>(null)
  const [isOpen, { setTrue: openPanel, setFalse: dismissPanel }] = useBoolean(false)
  const [CSRFStatus, setCSRFStatus] = useState("")
  const [currentCluster, setCurrentCluster] = useState<IClusterDetail>({ subscription: "", resource: "", clusterName: "", resourceId: "" }) // TODO: probably not best practice ... nullable reference?
  const [detailPanelSelected, setDetailPanelSelected] = useState<string>("overview");

  const [contentStackStyles, setContentStackStyles] = useState<IStackStyles>(contentStackStylesNormal)
  const [showColumns, setShowColumns] = useState<Boolean>(true)
  const sshRef = useRef<typeof SSHModal | null>(null)
  const csrfRef = useRef<string>("")

  const history = useHistory()

  // _setCurrentCluster is a helper function to wrap app state
  // TODO: can we just pass in setCurrentCluster rather then _setCurrentCluster?
  const _setCurrentCluster = (clusterDetail: IClusterDetail) => {
    setCurrentCluster(clusterDetail)
    setContentStackStyles(contentStackStylesSmall)
    setShowColumns(false);
    var res = history.location.pathname.substring(1, clusterDetail.resourceId.length + 1)
    if (res != clusterDetail.resourceId) {
      history.push(clusterDetail.resourceId)
    }
  }

  const _onCloseDetailPanel = () => {
    setContentStackStyles(contentStackStylesNormal)
    setDetailPanelSelected("overview")
    setShowColumns(true);
    history.replace("")
  }

  useEffect(() => {
    const onData = (result: AxiosResponse | null) => {
      if (result?.status === 200) {
        updateData(result.data)
        csrfRef.current = result.data.csrf
      } else {
        setError(result)
      }
      setCSRFStatus("DONE")
    }

    if (CSRFStatus === "") {
      setCSRFStatus("FETCHING")
      FetchInfo().then(onData)
    }
  }, [CSRFStatus, error, data])

  useEffect(() => {
    var routeObjs = checkRoute(history.location.pathname)
    if (routeObjs != null && routeObjs.length == 5) {

      const thisCluster: IClusterDetail = {
        clusterName: routeObjs[3],
        subscription: routeObjs[1],
        resource: routeObjs[2],
        resourceId: "subscriptions/" + routeObjs[1] + "/resourceGroups/" + routeObjs[2] + "/providers/Microsoft.RedHatOpenShift/openShiftClusters/" + routeObjs[3]
      }
      _setCurrentCluster(thisCluster)
      setDetailPanelSelected(routeObjs[4])
    }
    console.log(routeObjs);
  }, [])

  const onRenderNavigationContent: IRenderFunction<IPanelProps> = useCallback(
    (props, defaultRender) => (
      <>
        <IconButton iconProps={{ iconName: "GlobalNavButton" }} onClick={dismissPanel} />
      </>
    ),
    [dismissPanel]
  )

  const logOut = () => {
    ProcessLogOut()
  }

  const errorBar = (): any => {
    console.log(error)
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

  // Application state maintains the current resource id/name/group
  // when we click a thing set the state
  // ...

  return (
    <>
      <Stack styles={stackStyles} tokens={containerStackTokens} horizontalAlign={"stretch"}>
        <Panel
          isLightDismiss
          styles={navPanelStyles}
          type={PanelType.smallFixedNear}
          isOpen={isOpen}
          onDismiss={dismissPanel}
          closeButtonAriaLabel="Close"
          onRenderNavigationContent={onRenderNavigationContent}
        >
          <p>regions go here</p>
        </Panel>
        <ThemeProvider theme={darkTheme}>
          <Stack
            grow
            tokens={appStackTokens}
            horizontalAlign={"start"}
            verticalAlign={"center"}
            horizontal
            styles={stackNavStyles}
          >
            <Stack.Item>
              <IconButton
                iconProps={{ iconName: "GlobalNavButton" }}
                onClick={openPanel}
                styles={MenuButtonStyles}
                disabled
              />
            </Stack.Item>
            <Stack.Item grow>
              <Text styles={headerTextStyles}>
                ARO Portal {data.location ? "(" + data.location + ")" : ""}
              </Text>
            </Stack.Item>
            <Stack.Item>
              <Text>{data.username}</Text>
            </Stack.Item>

            <Stack.Item hidden={!data.elevated}>
              <TooltipHost content={`Elevated User`}>
                <Icon iconName={"Admin"}></Icon>
              </TooltipHost>
            </Stack.Item>
            <Stack.Item>
              <IconButton
                iconProps={{ iconName: "SignOut" }}
                onClick={logOut}
                styles={MenuButtonStyles}
              />
            </Stack.Item>
          </Stack>
        </ThemeProvider>
        <Stack styles={contentStackStyles}>
          <Stack.Item grow>{error && errorBar()}</Stack.Item>
          <Stack.Item grow>
            <ClusterList showColumns={showColumns} csrfToken={csrfRef} sshBox={sshRef} setCurrentCluster={_setCurrentCluster} loaded={CSRFStatus} />
          </Stack.Item>
          <Stack.Item grow>
            <ClusterDetailPanel csrfToken={csrfRef} loaded={CSRFStatus} detailPanelSelected={detailPanelSelected} currentCluster={currentCluster} onClose={_onCloseDetailPanel} />
          </Stack.Item>
        </Stack>
        <SSHModal csrfToken={csrfRef} ref={sshRef} />
      </Stack>
    </>
  )
}

export default withRouter(App)
