import {
  AmbientLight,
  AxesHelper,
  BoxBufferGeometry,
  GridHelper,
  RGBAFormat,
  TextureLoader,
  ObjectLoader,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  MOUSE,
  Object3D,
  Group,
  Clock,
  Raycaster,
  TetrahedronBufferGeometry,
  VideoTexture,
  PMREMGenerator,
  UnsignedByteType,
  HemisphereLight,
  CanvasTexture,
  AnimationMixer,
  MeshBasicMaterial,
  PlaneGeometry,
  CineonToneMapping,
  LinearToneMapping,
  QuadraticBezierCurve3
} from "three"
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { LightsList } from './Tlights'
import { helperList } from "./THelper"
export class TEngine {

  private dom: HTMLElement
  public renderer: WebGLRenderer
  private mixer: AnimationMixer | undefined
  private pmremGenerator!: PMREMGenerator
  private scene: Scene
  private raycaster: Raycaster
  private camera: PerspectiveCamera
  private clock: Clock
  private controls!: FirstPersonControls | OrbitControls
  public target = new Vector3()
  private model!: Group
  private heart!: Group
  private newEnterIndex = 0
  private character: Group
  private idlist = []
  private rotateStepID!: any
  private motionStepID!: any
  private platform: string
  stats: Stats
  constructor(dom: HTMLElement, platform: string) {
    this.dom = dom
    this.platform = platform;
    this.renderer = new WebGLRenderer({
      antialias: true
    })

    this.renderer.xr.enabled = true;
    this.clock = new Clock()
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = LinearToneMapping
    this.scene = new Scene()
    const pmremGenerator = new PMREMGenerator(this.renderer); // 使用hdr作为背景色
    pmremGenerator.compileEquirectangularShader();
    this.pmremGenerator = pmremGenerator;
    const scene = this.scene;

    new RGBELoader()
      .setDataType(UnsignedByteType)
      .load('/texture/autumn_forest_04_1k.hdr', function (texture) {

        const envMap = pmremGenerator.fromEquirectangular(texture).texture;

        pmremGenerator.dispose();
        console.log('here');
        scene.environment = envMap; // 给场景添加环境光效果
        scene.background = envMap; // 给场景添加背景图
      }, () => { }, (e) => { console.log('error in load env_texture', e); });

    this.camera = new PerspectiveCamera(60, dom.offsetWidth / dom.offsetHeight, 0.1, 1000)
    let character = new Group();
    character.add(this.camera);
    this.character = character;
    this.scene.add(this.character)
    this.renderer.setSize(dom.offsetWidth, dom.offsetHeight, true)

    // 初始性能监视器
    const stats = Stats()
    const statsDom = stats.domElement
    this.stats = stats;
    statsDom.style.position = 'fixed'
    statsDom.style.top = '0'
    statsDom.style.right = '5px'
    statsDom.style.left = 'unset'



    // let controls;

    //   controls = new FirstPersonControls(this.camera, this.dom);
    //   controls.lookSpeed = 0.2; //鼠标移动查看的速度
    //   controls.movementSpeed = 20; //相机移动速度
    //   // controls.noFly = true;
    //   // controls.constrainVertical = true; //约束垂直
    //   // controls.verticalMin = Math.PI / 2;

    //   // controls.verticalMax = Math.PI / 2 + 0.0000001;

    // this.controls = controls


    const raycaster = new Raycaster();
    this.raycaster = raycaster;
    const onWindowResize = () => {

      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(dom.offsetWidth, dom.offsetHeight, true);

    }
    window.addEventListener('resize', onWindowResize);

    this.renderer.setAnimationLoop(() => {
      // this.controls.update(this.clock.getDelta())
      this.camera.getWorldDirection(this.target)
      this.renderer.render(this.scene, this.camera)
      stats.update()
    })

    // this.addObject(...helperList)
    this.addObject(...LightsList)
    dom.appendChild(this.renderer.domElement)
    // dom.appendChild(statsDom)
    dom.appendChild(VRButton.createButton(this.renderer))
  }

  loadGun() {
    //载入模型
    const loader: GLTFLoader = new GLTFLoader()

    loader.load('/mp5/scene.gltf', (gltf) => {

      // this.mixer= new AnimationMixer(gltf.scene)
      // var action=this.mixer.clipAction(gltf.animations[0])
      // // action.timeScale=0.8
      // action.time=4
      gltf.scene.traverse((object) => {
        if ((object as Mesh).isMesh) {
          // 修改模型的材质
          object.castShadow = true;
          object.frustumCulled = false;
          // object.receiveShadow = true;

          (object as any).material.emissive = (object as any).material.color;
          (object as any).material.emissiveMap = (object as any).material.map;
        }
      })
      gltf.scene.receiveShadow = true
      this.model = gltf.scene
      this.scene.add(gltf.scene)
      this.character.add(gltf.scene)
      gltf.scene.position.set(5, -8, -8)
      console.log(this.model)

    }, () => { }, (e) => { console.log("error", e) })

  }

  loadRoom() {
    const loader: GLTFLoader = new GLTFLoader()

    loader.load('/abandoned_factory/scene.gltf', (gltf) => {

      // this.mixer= new AnimationMixer(gltf.scene)
      // var action=this.mixer.clipAction(gltf.animations[0])
      // // action.timeScale=0.8
      // action.time=4
      gltf.scene.traverse((object) => {
        if ((object as Mesh).isMesh) {
          // 修改模型的材质
          object.castShadow = true;
          object.frustumCulled = false;
          // object.receiveShadow = true;

          (object as any).material.emissive = (object as any).material.color;
          (object as any).material.emissiveMap = (object as any).material.map;
        }
      })
      gltf.scene.receiveShadow = true

      this.scene.add(gltf.scene)
      gltf.scene.scale.set(80, 80, 80)
      gltf.scene.position.set(0, 290, 0)

    }, () => { }, (e) => { console.log("error", e) })

  }
  addObject(...object: Object3D[]) {
    object.forEach(elem => {
      this.scene.add(elem)
    })
  }
  setRotate(a: number, b: number, g: number) {
    if (g > 0) {
      if (b < 0) {
        b = -180 - b
      } else {
        b = 180 - b
      }

    }
    a = a % 180;
    if (g < 0) {
      g = g + 180
    }
    if (!this.model) return
    this.model.rotation.z = (90 - g + 10) / 180 * Math.PI

    if(this.platform==='linux'){
      if (a > 35 && a < 85) {
        this.model.rotation.y = (a / 360 * 2 * Math.PI);
        this.camera.rotation.y = (a / 360 * 2 * Math.PI)
        if (this.rotateStepID > 0) {
          clearInterval(this.rotateStepID)
          this.rotateStepID = -1
        }
  
      } else if (a > 85 && a < 180) {
        if (!this.rotateStepID || this.rotateStepID < 0) {
          this.rotateStepID = setInterval(() => {
            this.character.rotation.y += Math.PI / 180;
          }, 10)
        }
  
  
  
      } else if (a < 35 || a > 300) {
        if (!this.rotateStepID || this.rotateStepID < 0) {
          this.rotateStepID = setInterval(() => {
            this.character.rotation.y -= Math.PI / 180;
          }, 10)
        }
      }
  
      if (b < 25 && b > -25) {
        this.model.rotation.x = (b / 360 * 2 * Math.PI);
        if (this.motionStepID > 0) {
          clearInterval(this.motionStepID);
          this.motionStepID = -1
        }
      }
  
  
      if (b < -25 || b > 25) {
        if (!this.motionStepID || this.motionStepID < 0) {
          this.motionStepID = setInterval(() => {
            this.character.position.x += this.target.x;
            // this.camera.position.x+=this.target.x;
            this.character.position.z += this.target.z;
          }, 10)
        }
  
        // this.model.position.x+=this.target.x;
        // this.model.position.z+=this.target.z;
  
        // 
        // console.log(this.target)
      }
      // this.model.rotation.z=(g/360*2*Math.PI);
    }else{
      this.model.rotation.y = (a / 360 * 2 * Math.PI);
      if (b < 25 && b > -25) {
        this.model.rotation.x = (b / 360 * 2 * Math.PI);
        if (this.motionStepID > 0) {
          clearInterval(this.motionStepID);
          this.motionStepID = -1
        }
      }
  
  
      if (b < -25 || b > 25) {
        if (!this.motionStepID || this.motionStepID < 0) {
          this.motionStepID = setInterval(() => {
            this.character.position.x += this.target.x;
            // this.camera.position.x+=this.target.x;
            this.character.position.z += this.target.z;
          }, 10)
        }
  
        // this.model.position.x+=this.target.x;
        // this.model.position.z+=this.target.z;
  
        // 
        // console.log(this.target)
      }
      // this.model.rotation.z=(g/360*2*Math.PI);
    }

  }

  disableControls() {
    this.controls.enabled = false
  }
  enableControls() {
    this.controls.enabled = true
  }
}
