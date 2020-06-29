import React, { useState, useEffect } from "react"

import Layout, { Content } from "../components/Layout"
import SEO from "../components/SEO"
import PageTitle from "../components/PageTitle"

// TODO don't allow stacking FM140R-FM160R on top of A.S. Solutions
// TODO adapter descriptions/notes?

// Other notes:
// - Show under results:
//   - Brief differences between Shimano/Magura/SRAM/Avid/Tektro-TRP
// - Show under results when mount=FM and caliper=FM:
//   - "Flat mount" doesn't include Shimano BR-UR300 or Hope RX4 with integrated mount plates / 160mm adapters
// - Show under results when mount=PM/IS and caliper=FM:
//   - AS Solutions flat mount adapter compatibility is based on specific frame and caliper geometry
// - Show under results when caliper=PM:
//   - For SRAM/Avid adapters, omit cup washers unless it's a CPS (lower-end) caliper

const MAX_ADAPTERS = 2

const SIDE_FRONT = "front"
const SIDE_REAR = "rear"
const MOUNT_IS160F = "IS160F"
const MOUNT_IS160R = "IS160R"
const MOUNT_PM140 = "PM140"
const MOUNT_PM160 = "PM160"
const MOUNT_PM170 = "PM170" // output-only
const MOUNT_PM180 = "PM180"
const MOUNT_PM185 = "PM185" // output-only
const MOUNT_PM200 = "PM200" // output-only
const MOUNT_PM203 = "PM203" // output-only
const MOUNT_FM140F = "FM140F"
const MOUNT_FM140R = "FM140R"
const MOUNT_FM160R = "FM160R" // output-only
const MOUNT_FM180R = "FM180R" // output-only
const CALIPER_POST = "post"
const CALIPER_FLAT = "flat"
const ROTOR_140 = 140
const ROTOR_160 = 160
const ROTOR_170 = 170
const ROTOR_180 = 180
const ROTOR_185 = 185
const ROTOR_200 = 200
const ROTOR_203 = 203

const mountNames = {
  [MOUNT_IS160F]: "IS Front",
  [MOUNT_IS160R]: "IS Rear",
  [MOUNT_PM140]: "Post Mount 140",
  [MOUNT_PM160]: "Post Mount 160",
  [MOUNT_PM170]: "Post Mount 170",
  [MOUNT_PM180]: "Post Mount 180",
  [MOUNT_PM185]: "Post Mount 185",
  [MOUNT_PM200]: "Post Mount 200",
  [MOUNT_PM203]: "Post Mount 203",
  [MOUNT_FM140F]: "Flat Mount 140 Front",
  [MOUNT_FM140R]: "Flat Mount 140 Rear",
  [MOUNT_FM160R]: "Flat Mount 160 Rear",
  [MOUNT_FM180R]: "Flat Mount 180 Rear",
}

const allRotors = [
  ROTOR_140,
  ROTOR_160,
  ROTOR_170,
  ROTOR_180,
  ROTOR_185,
  ROTOR_200,
  ROTOR_203,
]

function caliperMount(caliper, rotor) {
  if (!caliper || !rotor) {
    return null
  } else if (caliper === CALIPER_POST) {
    switch (rotor) {
      case ROTOR_140:
        return MOUNT_PM140
      case ROTOR_160:
        return MOUNT_PM160
      case ROTOR_170:
        return MOUNT_PM170
      case ROTOR_180:
        return MOUNT_PM180
      case ROTOR_185:
        return MOUNT_PM185
      case ROTOR_200:
        return MOUNT_PM200
      case ROTOR_203:
        return MOUNT_PM203
      default:
        break
    }
  } else if (caliper === CALIPER_FLAT) {
    switch (rotor) {
      case ROTOR_140:
        return MOUNT_FM140R
      case ROTOR_160:
        return MOUNT_FM160R
      case ROTOR_180:
        return MOUNT_FM180R // for A.S. Solutions IS-FM on Front
      default:
        break
    }
  }

  throw new Error(`Unsupported caliper/rotor: ${caliper}/${rotor}`)
}

function deriveSide(mount) {
  switch (mount.slice(-1)) {
    case "F":
      return SIDE_FRONT
    case "R":
      return SIDE_REAR
    default:
      return null
  }
}

const allAdapters = [
  {
    brand: "Avid",
    model: "IS160F-PM180 or IS160R-PM160",
    configs: [
      [MOUNT_IS160F, MOUNT_PM180],
      [MOUNT_IS160R, MOUNT_PM160],
    ],
  },
  {
    brand: "Avid",
    model: "IS160F-PM200 or IS160R-PM180",
    configs: [
      [MOUNT_IS160F, MOUNT_PM200],
      [MOUNT_IS160R, MOUNT_PM180],
    ],
  },
  {
    brand: "Avid",
    model: "PM +20mm",
    configs: [
      [MOUNT_PM140, MOUNT_PM160],
      [MOUNT_PM160, MOUNT_PM180],
      [MOUNT_PM180, MOUNT_PM200],
    ],
  },
  {
    brand: "Shimano",
    model: "FM Mount Plate 140 or 160",
    configs: [
      [MOUNT_FM140F, MOUNT_FM140R],
      [MOUNT_FM140F, MOUNT_FM160R],
    ],
  },
  {
    brand: "A.S. Solutions",
    model: "IS-FM",
    configs: [
      [MOUNT_IS160F, MOUNT_FM180R],
      [MOUNT_IS160R, MOUNT_FM160R],
    ],
  },
  {
    brand: "KCNC",
    model: "Flat to Post, Front 140mm",
    configs: [[MOUNT_FM140F, MOUNT_PM140]],
  },
  {
    brand: "KCNC",
    model: "Flat to Post, Rear 160mm",
    configs: [[MOUNT_FM140R, MOUNT_PM160]],
  },
]

// from => to => set of adapter indices for final lookup
const adapterLookup = allAdapters.reduce(
  (outerAcc, { configs }, i) =>
    configs.reduce((acc, [from, to]) => {
      if (!acc[from]) {
        acc[from] = {}
      }
      if (!acc[from][to]) {
        acc[from][to] = new Set()
      }
      acc[from][to].add(i)
      return acc
    }, outerAcc),
  {}
)

// Form an adjacency list representing edges of the
// directed graph of possible adapter configs
const adjList = allAdapters.reduce(
  (outerAcc, { configs }) =>
    configs.reduce((acc, [from, to]) => {
      if (!acc[from]) {
        acc[from] = new Set()
      }
      acc[from].add(to)
      return acc
    }, outerAcc),
  {}
)

// Find all paths from one mount to another using a depth-first search
function allAdapterPaths(from, to) {
  const paths = []
  const visited = new Set()
  const currentPath = []

  function pathsInner(f) {
    visited.add(f)
    currentPath.push(f)

    if (f === to) {
      // Limit path length
      if (currentPath.length - 1 <= MAX_ADAPTERS) {
        paths.push([...currentPath])
      }
    } else if (adjList[f]) {
      adjList[f].forEach(adj => {
        if (!visited.has(adj)) {
          pathsInner(adj)
        }
      })
    }

    currentPath.pop()
    visited.delete(f)
  }

  pathsInner(from)

  // Sort by path length ascending
  return paths.sort((a, b) => a.length - b.length)
}

function pathToAdapters(path) {
  const [from, to, next] = path
  switch (path.length) {
    case 2:
      return [[...adapterLookup[from][to]].map(i => allAdapters[i])]
    case 3:
      return pathToAdapters([from, to]).concat(pathToAdapters([to, next]))
    default:
      return []
  }
}

const AdapterList = ({ adapters }) => {
  return (
    <ul>
      {adapters.map(({ brand, model }) => (
        <li key={`${brand}%%%${model}`}>
          {brand} {model}
        </li>
      ))}
    </ul>
  )
}

const Results = ({ mount, caliper, rotor }) => {
  const paths = allAdapterPaths(mount, caliperMount(caliper, rotor))

  const side = deriveSide(mount)

  if (paths.length === 0) {
    return <p>No adapters found.</p>
  }

  const hasMultiplePaths = paths.length > 1

  return (
    <>
      {paths.map((path, i) => {
        switch (path.length) {
          case 1:
            // No adapter
            return (
              <div key={path[0]}>
                <h3>No Adapter Required</h3>
                <p>
                  This configuration does not require an adapter. The caliper
                  can be mounted directly on the{" "}
                  {side
                    ? side === SIDE_FRONT
                      ? "fork"
                      : "frame"
                    : "frame or fork"}
                  .
                </p>
              </div>
            )
          case 2:
            // Single adapter
            const [adapters] = pathToAdapters(path)
            return (
              <div key={`${path[0]}-${path[1]}`}>
                <h3>
                  {hasMultiplePaths && `${i + 1}. `}Solution With Single Adapter
                </h3>
                <p>Pick one adapter:</p>
                <AdapterList adapters={adapters} />
              </div>
            )
          case 3:
            // Two adapters
            const [lowerAdapters, upperAdapters] = pathToAdapters(path)

            const intermediateName = mountNames[path[1]]

            return (
              <div key={`${path[0]}-${path[1]}-${path[2]}`}>
                <h3>
                  {hasMultiplePaths && `${i + 1}. `}Solution With Two Adapters:{" "}
                  {intermediateName} Intermediate
                </h3>
                <p>
                  Uses two adapters with {intermediateName} as an intermediate
                  step. Pick one of the lower adapters and one of the upper
                  adapters for this brake. Not ideal, but can work in a pinch.
                </p>
                <h4>Lower adapters</h4>
                <AdapterList adapters={lowerAdapters} />
                <h4>Upper adapters</h4>
                <AdapterList adapters={upperAdapters} />
              </div>
            )
          default:
            return null
        }
      })}
    </>
  )
}

const MountOption = ({ mount, ...restProps }) => (
  <option value={mount} {...restProps}>
    {mountNames[mount]}
  </option>
)

const DiscBrakeAdapterFinder = () => {
  const [mount, setMount] = useState(null)
  const [caliper, setCaliper] = useState(null)
  const [rotor, setRotor] = useState(null)

  const allowedRotors =
    // If caliper is flat mount...
    caliper === CALIPER_FLAT
      ? // and FM140F or FM140R mount, allow 140/160
        mount === MOUNT_FM140F || mount === MOUNT_FM140R
        ? [ROTOR_140, ROTOR_160]
        : // otherwise (for PM/IS mount), optimistically allow 140/160/180
          [ROTOR_140, ROTOR_160, ROTOR_180]
      : // If IS160F mount [and caliper is post mount], allow >= 160
      mount === MOUNT_IS160F
      ? allRotors.filter(r => r >= ROTOR_160)
      : // If PM160 mount [and caliper is post mount], allow >= 160
      mount === MOUNT_PM160
      ? allRotors.filter(r => r >= ROTOR_160)
      : // If PM180 mount [and caliper is post mount], allow >= 180
      mount === MOUNT_PM180
      ? allRotors.filter(r => r >= ROTOR_180)
      : allRotors

  useEffect(() => {
    if (mount && rotor && !allowedRotors.includes(rotor)) {
      setRotor(null)

      // window.alert(
      //   `The selected frame/fork mount only allows these rotor sizes: ${allowedRotors.join(
      //     ", "
      //   )}. Please select one of those rotor sizes.`
      // )
    }
  }, [mount, rotor, allowedRotors])

  const isCompleted = mount && caliper && rotor && allowedRotors.includes(rotor)

  /* eslint-disable jsx-a11y/no-onchange */
  return (
    <div>
      <form className="form">
        <div className="field">
          <label htmlFor="dbaf-mount">
            <span>Frame/fork mount</span>
            <select
              id="dbaf-mount"
              name="dbaf-mount"
              value={mount || ""}
              onChange={e => setMount(e.target.value || null)}
            >
              <option value="">&mdash;</option>
              <optgroup label="IS">
                <MountOption mount={MOUNT_IS160F} />
                <MountOption mount={MOUNT_IS160R} />
              </optgroup>
              <optgroup label="Flat Mount">
                <MountOption mount={MOUNT_FM140F} />
                <MountOption mount={MOUNT_FM140R} />
              </optgroup>
              <optgroup label="Post Mount">
                <MountOption mount={MOUNT_PM140} />
                <MountOption mount={MOUNT_PM160} />
                <MountOption mount={MOUNT_PM180} />
              </optgroup>
            </select>
          </label>
        </div>
        <div className="field">
          <label htmlFor="dbaf-caliper">
            <span>Caliper</span>
            <select
              id="dbaf-caliper"
              name="dbaf-caliper"
              value={caliper || ""}
              onChange={e => setCaliper(e.target.value || null)}
            >
              <option value="">&mdash;</option>
              <option value={CALIPER_POST}>Post mount</option>
              <option value={CALIPER_FLAT}>Flat mount</option>
            </select>
          </label>
        </div>
        <div className="field">
          <label htmlFor="dbaf-rotor">
            <span>Rotor</span>
            <select
              id="dbaf-rotor"
              name="dbaf-rotor"
              value={rotor ? `${rotor}` : ""}
              onChange={e =>
                setRotor(e.target.value ? parseInt(e.target.value, 10) : null)
              }
            >
              <option value="">&mdash;</option>
              {allRotors.map(rs => (
                <option
                  value={`${rs}`}
                  key={rs}
                  disabled={!allowedRotors.includes(rs)}
                >
                  {rs}mm
                </option>
              ))}
            </select>
          </label>
        </div>
      </form>

      {isCompleted && (
        <>
          <h2>Results</h2>
          <Results mount={mount} caliper={caliper} rotor={rotor} />
        </>
      )}
    </div>
  )
  /* eslint-enable jsx-a11y/no-onchange */
}

const DiscBrakeAdapterFinderPage = () => (
  <Layout>
    <SEO
      title="Disc Brake Adapter Finder"
      description="Find the correct disc brake adapter for your frame, fork, calipers, and rotors"
    />
    <PageTitle>Disc Brake Adapter Finder</PageTitle>
    <Content>
      <p>
        I think almost every bike mechanic has accidentally ordered the wrong
        disc brake adapter at one time or another. I decided to make a simple
        online wizard to make it easy. Simply enter your frame/fork mount
        standard, caliper standard, and rotor size. It should return a list of
        possible adapters, or adapter combinations if necessary.
      </p>
      <DiscBrakeAdapterFinder />
    </Content>
  </Layout>
)

export default DiscBrakeAdapterFinderPage
