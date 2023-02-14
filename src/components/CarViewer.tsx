import {FC, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useDrag, useWheel} from "@use-gesture/react";
import styled, {css, keyframes} from "styled-components";
import {AiFillCheckCircle, AiFillExclamationCircle} from "react-icons/ai";
import {Tooltip as ReactTooltip} from 'react-tooltip'
import ReactDOMServer from 'react-dom/server';
import {number} from "prop-types";
import {IModel} from "@/lib/IModel";
import {cdnUri} from "@/components/utils";

const SLOW_DOWN = 10


const InfoSpot = styled.a<{ top: number | false, left: number | false, visible?: boolean }>`
  display: ${props => props.visible ? 'block' : 'none'};
  position: absolute;
  top: ${(props: { top: any; }) => props.top || 0}%;
  left: ${(props: { left: any; }) => props.left || 0}%;
  cursor: pointer;

  div {

  }
`

const FeatureSpot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 100%;
  background-color: rgb(30, 203, 60);
  border: 1px solid rgb(255, 255, 255);
  pointer-events: none;
  box-shadow: rgb(0 0 0 / 10%) -2px 2px 1px;
  transition: all 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`

const DamageSpot = styled.div`

  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  filter: drop-shadow(rgba(0, 0, 0, 0.1) -2px 2px 1px);
  transform: translate(0px, -1.09565px);
  transform-origin: left top;
  transition: transform 250ms cubic-bezier(0.86, 0, 0.07, 1) 0s;

  svg {
    position: absolute;
    transform: translate(-50%, -60%);

    path {
      transition: d 250ms ease 0s, stroke-width 250ms ease 0s;
      stroke-width: 1px;
      stroke: rgb(255, 255, 255);
      fill: rgb(254, 185, 72);
      stroke-linejoin: round;
      stroke-linecap: round;
    }
  }
`

const pulse = keyframes`
  0% {
    opacity: 1;
    transform: scale(0.1);
    transform-origin: center;
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
`


const FeatureSpotAnimation = styled.div<{ delay?: number }>`
  ${props => props.delay && css`
    animation-delay: ${props.delay}s;
  `}
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-image: radial-gradient(40px at 710.34% 770.69%, rgba(30, 203, 60, 0) 0%, rgb(30, 203, 60) 100%);
  transform: scale(0) translate(-50%, -50%);
  pointer-events: none;
  animation-duration: 3s;
  animation-name: ${pulse};
  animation-iteration-count: infinite;

  &.damage {
    background-image: radial-gradient(37px at 1117.24% 648.28%, rgba(254, 185, 72, 0) 0%, rgb(254, 185, 72) 100%);
  }
`


const Content = styled.div`
  color: #111;
`

const infoSpots: any[] = [
    // {
    //     title: 'New Goodyear Tires',
    //     description: '50K Miles Warranty',
    //     type: 'feature',
    //     frames: [9, 10, 11, 12, 13, 14, 15, 16, 17],
    //     positions: [[52, 56], [46, 56], [40, 56], [33, 56], [26, 56], [19, 56], [12, 57], [7, 58], [2, 59]]
    // },
    // {
    //     title: 'Minor Scratch',
    //     description: 'Superficial scratches in the clear coat.',
    //     type: 'damage',
    //     image: '/imperfection-1.jpeg',
    //     frames: [1, 2, 3, 4, 5],
    //     positions: [[64, 57], [61, 57], [59, 57], [55, 57], [52, 57.5]],
    // }
]


const CarViewer: FC<{ model: IModel }> = ({model}) => {

    const canvasRef = useRef<any>()
    const [currentImage, setCurrentImage] = useState(1)
    const [images, setImages] = useState<HTMLImageElement[]>([])


    const currentFrame = useCallback((index: number) => {
        return cdnUri(model.frames[index - 1])
    }, [])


    const preloadImages = useCallback(() => {

        const _images = [...images]
        for (let i = 1; i < model.totalFrames; i++) {
            if (!images[i]) {
                _images[i] = new Image();
                //TODO:  Not sure if this actually helps. Need to research
                _images[i].src = currentFrame(i);
                _images[i].style.objectFit = 'contain'
                _images[i].width = 1158
                _images[i].height = 700
            }
        }

        setImages(_images)
    }, [model])


    useEffect(() => {

        if (!canvasRef.current) {
            return
        }

        console.log(canvasRef.current)

        canvasRef.current.width = 1158;
        canvasRef.current.height = 700;
        const _images = [...images]

        _images[1] = new Image()
        _images[1].src = currentFrame(1);
        _images[1].style.objectFit = 'contain'
        _images[1].width = 1158
        _images[1].height = 700
        _images[1].onload = () => {
            canvasRef.current?.getContext('2d')?.drawImage(_images[1], 0, 0, 1158, 700);
        }


        setImages(_images)

        preloadImages()

    }, [])

    const updateImage = (index: number) => {

        canvasRef.current?.getContext('2d')?.drawImage(images[index], 0, 0, 1158, 700);
    }




    const playVideo = (pos: number) => {

        requestAnimationFrame(() => updateImage(pos))

    }


    const moveViewer = (movement: [number, number], last: boolean, direction: -1 | 1) => {


        let mov = Math.ceil((direction * movement[0]) / SLOW_DOWN)

        const dPos = Number(canvasRef.current?.dataset.pos)

        mov = mov + dPos


        if (mov < 1) {
            mov = model.totalFrames + mov
        }

        if (mov >= model.totalFrames) {
            mov = mov - (model.totalFrames - 1)
        }


        playVideo(mov)

        if (last) {
            // @ts-ignore
            canvasRef.current.dataset.pos = mov
        }
        setCurrentImage(mov)
    }

    const bind = useDrag(({movement, last}) => {
        moveViewer(movement, last, -1)
    }, {
        axis: 'x'
    })


    const bindScroll = useWheel(({movement, last}) => {
        moveViewer(movement, last, 1)
    }, {
        axis: 'x',
    })

    useEffect(() => {
        if(canvasRef.current && window.innerWidth){
            if(window.innerWidth < 700){
                canvasRef.current.style.height = canvasRef.current.width / 3 + 'px'
            }
        }
    }, [])

    return (

        <div className={"position-relative"}>
            <div {...bindScroll()}>
                <div className={"grab-container"} style={{
                    touchAction: 'none',
                    borderRadius: '8px',
                    width: '100%',
                    maxWidth: 1200,
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }} {...bind()}>
                    <canvas data-pos={0} ref={canvasRef} style={{
                        height: 'calc(100vh - 170px)',
                        width: '100%',
                        maxWidth: '100%',
                        objectFit: 'cover'
                    }}/>
                </div>

                <div className={"info-spots"}>
                    {infoSpots.map((spot, idx) => (
                        <InfoSpot
                            key={idx}
                            left={spot.frames.includes(currentImage) && spot.positions[spot.frames.indexOf(currentImage)][0]}
                            top={spot.frames.includes(currentImage) && spot.positions[spot.frames.indexOf(currentImage)][1]}
                            data-tip data-for={`info-${idx}`}
                            visible={spot.frames.includes(currentImage)}
                        >

                            {spot.type === 'feature' ?
                                <div style={{width: 60, height: 60}}>
                                    <FeatureSpotAnimation/>
                                    <FeatureSpotAnimation delay={1}/>
                                    <FeatureSpotAnimation delay={2}/>
                                    <FeatureSpot/>
                                </div> : <div style={{width: 60, height: 60}}>
                                    <FeatureSpotAnimation className={"damage"}/>
                                    <FeatureSpotAnimation className={"damage"} delay={1}/>
                                    <FeatureSpotAnimation className={"damage"} delay={2}/>
                                    <DamageSpot>
                                        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15"
                                             height="11.956521739130435" color="#feb948">
                                            <path
                                                d="M 7.5 0.5,14.5 11.456521739130435,0.5, 11.456521739130435 z"
                                                fill={"#feb948"}></path>
                                        </svg>
                                    </DamageSpot>
                                </div>}
                            <ReactTooltip id={`info-${idx}`} place="top"
                                          html={ReactDOMServer.renderToString(<Content>
                                              <div style={{width: spot.image ? 300 : 'auto'}}>
                                                  <div className="row no-gutters">
                                                      {spot.image && <div className="col-sm-5">
                                                          <img className="card-img"
                                                               style={{height: '100%', objectFit: 'cover'}}
                                                               src={spot.image}/>
                                                      </div>}
                                                      <div className={spot.image ? 'col-sm-7' : 'col-sm-12'}>
                                                          <div className="card-body">
                                                              {spot.type === 'feature' ?
                                                                  <div className={"text-primary"}>FEATURE</div> :
                                                                  <div className={"text-warning"}>DAMAGE</div>}
                                                              <h5 className="card-title">{spot.title}</h5>
                                                              <p className="card-text">{spot.description}</p>
                                                              <a className=" btn-link">View Details</a>
                                                          </div>
                                                      </div>
                                                  </div>
                                              </div>
                                          </Content>)}
                                          className={"tooltipExterior"}
                                          delayHide={1000}
                                          clickable={true}/>


                        </InfoSpot>
                    ))}
                </div>
            </div>
        </div>

    );


}

export default CarViewer
