import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Vector3 } from 'three';
import { TweenMax, Power2, TimelineLite, TimelineMax } from "gsap/TweenMax";

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.sass']
})
export class CanvasComponent implements OnInit {


  constructor() { }

  public scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mesh: THREE.Mesh;
  private meshTwo: THREE.Mesh;
  private controls: OrbitControls;
  private tl: TimelineMax;
  private tltwo: TimelineMax;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selected: THREE.Mesh;

  @ViewChild("mycanvas") mycanvas: ElementRef;
  ngOnInit() {

    this.init();
    this.addMeshes();
    this.addGrid();
    this.light();
    this.move();
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.renderer.render(this.scene, this.camera);
    this.animate();

  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));
    this.controls.update();
    this.camera.updateProjectionMatrix();
    this.meshTwo.rotation.x += 0.01;
    this.meshTwo.rotation.y += 0.01;
    this.meshTwo.rotation.z += 0.01;

    this.renderer.render(this.scene, this.camera);
  };

  init() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(90, 500 / 500, 0.1, 1000);
    this.camera.position.set(-45, 100, -45);
    //this.camera.lookAt( this.scene.position );

    this.camera.updateMatrixWorld(true);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setClearColor("#505050");
    this.renderer.setSize(500, 500);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    this.mycanvas.nativeElement.appendChild(this.renderer.domElement);
    this.renderer.render(this.scene, this.camera);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  addMeshes() {
    var geometry = new THREE.SphereGeometry(10, 100, 100);
    var material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF });
    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.position.set(0, 10, 0);
    this.scene.add(this.mesh);

    var cylinder = new THREE.CylinderGeometry(5, 5, 20, 50);
    this.meshTwo = new THREE.Mesh(cylinder, material);
    this.meshTwo.position.set(0, 30, 0);
    this.meshTwo.rotation.x = Math.PI / 2;
    this.scene.add(this.meshTwo);
  }

  addGrid() {
    var gridXZ = new THREE.GridHelper(100, 10, new THREE.Color(0xff0000), new THREE.Color(0xffffff));
    this.scene.add(gridXZ);
  }

  light() {
    var light = new THREE.PointLight(0xFFFFFF, 2, 500);
    light.position.set(0, 250, 0);
    // light.position.set(100, 90, 100);
    // var lightTwo = new THREE.PointLight(0xFF0000, 2, 500);
    // lightTwo.position.set(-100, 90, 100);
    // var lightThree = new THREE.PointLight(0x0000FF, 2, 500);
    // lightThree.position.set(-100, 90, -100);
    // var lightFour = new THREE.PointLight(0x00FF00, 2, 500);
    // lightFour.position.set(100, 90, -100);
    // this.scene.add(lightFour);
    // this.scene.add(lightThree);
    // this.scene.add(lightTwo);
    this.scene.add(light);
  }

  move() {
    this.tl = new TimelineMax({ repeat: -1 });
    this.tltwo = new TimelineMax({ repeat: -1 });
    var tll = new TimelineMax({ repeat: -1 });
    this.tl.to(this.camera.position, 6, { x: -45, y: 100, z: 45 });
    this.tl.to(this.camera.position, 6, { x: 45, y: 100, z: 45 });
    this.tl.to(this.camera.position, 6, { x: 45, y: 100, z: -45 });
    this.tl.to(this.camera.position, 6, { x: -45, y: 100, z: -45 });


    this.tltwo.to(this.mesh.position, 3, { x: 0, y: 40, z: 0 });
    this.tltwo.to(this.mesh.position, 3, { x: 0, y: 10, z: 0 });
    this.tltwo.to(this.mesh.position, 3, { x: 0, y: 40, z: 0 });
    this.tltwo.to(this.mesh.position, 3, { x: 0, y: 10, z: 0 });

    tll.to(this.meshTwo.position, 3, { x: 0, y: 30, z: 50 });
    tll.to(this.meshTwo.position, 3, { x: 0, y: 30, z: 0 });
    tll.to(this.meshTwo.position, 3, { x: 0, y: 30, z: -50 });
    tll.to(this.meshTwo.position, 3, { x: 0, y: 30, z: 0 });
    tll.to(this.meshTwo.position, 3, { x: 50, y: 30, z: 0 });
    tll.to(this.meshTwo.position, 3, { x: 0, y: 30, z: 0 });
    tll.to(this.meshTwo.position, 3, { x: -50, y: 30, z: 0 });
    tll.to(this.meshTwo.position, 3, { x: 0, y: 30, z: 0 });

  }

  myClick(event: any) {
    //console.log("click... ", event);
    event.preventDefault();

    const targetRect = (event.target as Element).getBoundingClientRect();
    var rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - targetRect.left) / targetRect.width) * 2 - 1;
    this.mouse.y = (-(event.clientY - targetRect.top) / targetRect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    this.render();
  }

  render() {
    var intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects.length > 0) {
      this.selected = intersects[0].object as THREE.Mesh;
      var color = (Math.random() * 0xffffff);
      var material = new THREE.MeshLambertMaterial({ color: color });
      this.selected.material = material;
    }
  }

}
