import {
  Mesh,
  BoxBufferGeometry,
  MeshStandardMaterial,
  SphereBufferGeometry,
  CylinderBufferGeometry,
  Object3D,
  Line,
  Points,
  PointsMaterial,
  Material,
  PlaneBufferGeometry,
  CircleBufferGeometry
} from 'three'
import { pictureTexture } from './TTextures'

export const basicObjectList: Object3D[] = []

// 地面
const stage: Mesh = new Mesh(
  new BoxBufferGeometry(200, 10, 200),
  new MeshStandardMaterial({
    color: 'rgb(0, 75, 75)',
    roughness: 0.1
  })
)

stage.castShadow = true
stage.receiveShadow = true

stage.position.y = -5

// 立方体
const box: Mesh = new Mesh(
  new BoxBufferGeometry(2, 10, 2),
  new MeshStandardMaterial({
    color: '#b57355',
    metalness:0.5,
    roughness: 0.3
  })
)

box.castShadow = true
box.receiveShadow = true

box.position.set(-10,5,-10)

// 相框
const plane: Mesh = new Mesh(
  new PlaneBufferGeometry(192, 108),
  new MeshStandardMaterial({
    map: pictureTexture
  })
)

plane.position.y = 45
plane.scale.set(0.3, 0.3, 0.3)

//墙壁
const leftWall:Mesh=new Mesh(
  new PlaneBufferGeometry(100, 40),
  new MeshStandardMaterial({
    color: 'red'
  })
)
leftWall.position.set(0,20,-50)

const rightWall:Mesh=new Mesh(
  new PlaneBufferGeometry(100, 40),
  new MeshStandardMaterial({
    color: 'red'
  })
)
rightWall.rotateY(Math.PI/2)
rightWall.position.set(-50,20,0)

//桌面
const table:Mesh=new Mesh(
  new CircleBufferGeometry(10,90),
  new MeshStandardMaterial({
    color: '#fff222',
    metalness:0.3,
    roughness:0.3
  })
)
table.castShadow = true
table.receiveShadow = true
table.rotateX(-Math.PI/2)
table.position.set(-10,10,-10)










basicObjectList.push(stage, leftWall,rightWall ,table,box)