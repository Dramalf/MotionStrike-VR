import { Object3D } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
//模型
export const ModelsList: Object3D[] = []

const loader:GLTFLoader = new GLTFLoader()

loader.load('/models/girl/scene.gltf',function(gltf){

    gltf.scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          // 修改模型的材质
          object.castShadow = true
          object.receiveShadow = true
        }
      })
  gltf.scene.receiveShadow = true
    ModelsList.push(gltf.scene)
      gltf.scene.position.set(10,13,10)
      gltf.scene.scale.set(3,3,3)
},()=>{},()=>{console.log("errpr")})
