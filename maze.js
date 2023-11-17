import * as THREE from "three";
import Ground from "./ground.js";
import Wall from "./wall.js";
import Door from "./door.js";
import Elevator from "./elevator.js";
import { elevatorData } from "./default_data.js";

/*
 * parameters = {
 *  url: String,
 *  credits: String,
 *  scale: Vector3
 * }
 */

export default class Maze {
    constructor(parameters) {
        this.onLoad = function (description) {
            // Store the maze's map and tamanho
            this.map = description.map;
            this.tamanho = description.tamanho;

            // Store the player's initial position and direction
            this.initialPosition = this.cellToCartesian(description.initialPosition);
            this.initialDirection = description.initialDirection;

            // Store the maze's exit location
            this.exitLocation = this.cellToCartesian(description.exitLocation);

            // Create a group of objects
            this.object = new THREE.Group();

            // Create the ground
            this.ground = new Ground({ textureUrl: description.groundTextureUrl, tamanho: description.tamanho });
            this.object.add(this.ground.object);

            // Create a wall
            this.wall = new Wall({ textureUrl: description.wallTextureUrl });

            // Create a door
            this.door = new Door({ textureUrl: description.doorTextureUrl });

            this.elevatorPosition = this.cellToCartesian(description.elevadores.posicao); 
            this.elevatorDirection = description.elevadores.direcao;

            // Build the maze
            let wallObject;
            let doorObject;
            for (let i = 0; i <= description.tamanho.comprimento; i++) { // In order to represent the eastmost walls, the map comprimento is one column greater than the actual maze comprimento
                for (let j = 0; j <= description.tamanho.largura; j++) { // In order to represent the southmost walls, the map largura is one row greater than the actual maze largura
                    /*
                    * description.map[][] | North wall | West wall
                    * --------------------+------------+-----------
                    *          0          |     No     |     No
                    *          1          |     No     |    Yes
                    *          2          |    Yes     |     No
                    *          3          |    Yes     |    Yes
                    * 
                    * description.map[][] | North wall | West wall | North door | West door
                    * --------------------+------------+-----------+------------+-----------
                    *          4          |     No     |    No     |     No     |    Yes
                    *          5          |     No     |    No     |     Yes    |    No
                    *          6          |     Yes    |    No     |     No     |    Yes
                    *          7          |     No     |    Yes    |     Yes    |    No
                    * 
                    * description.map[][] | North wall | West wall | North elevator | West elevator
                    * --------------------+------------+-----------+----------------+---------------
                    *          8          |     No     |    No     |       No       |      Yes
                    *          9          |     No     |    No     |       Yes      |      No
                    *          10         |     Yes    |    No     |       No       |      Yes
                    *          11         |     No     |    Yes    |       Yes      |      No
                    */

                    //adição de parede virada a norte
                    if (description.map[j][i] == 2 || description.map[j][i] == 3 || description.map[j][i] == 6 || description.map[j][i] == 10) {
                        wallObject = this.wall.object.clone();
                        wallObject.position.set(i - description.tamanho.comprimento / 2.0 + 0.5, 0.5, j - description.tamanho.largura / 2.0);
                        this.object.add(wallObject);
                    }
                    //adição de parede virada a oeste 
                    if (description.map[j][i] == 1 || description.map[j][i] == 3 || description.map[j][i] == 7 || description.map[j][i] == 11) {
                        wallObject = this.wall.object.clone();
                        wallObject.rotateY(Math.PI / 2.0);
                        wallObject.position.set(i - description.tamanho.comprimento / 2.0, 0.5, j - description.tamanho.largura / 2.0 + 0.5);
                        this.object.add(wallObject);
                    }

                    //adição de porta virada a norte
                    if (description.map[j][i] == 5 || description.map[j][i] == 7) {
                        doorObject = this.door.object.clone();
                        doorObject.position.set(i - description.tamanho.comprimento / 2.0 + 0.5, 0.5, j - description.tamanho.largura / 2.0);
                        this.object.add(doorObject);
                    }
                    //adição de porta virada a oeste
                    if (description.map[j][i] == 4 || description.map[j][i] == 6) {
                        doorObject = this.door.object.clone();
                        doorObject.rotateY(Math.PI / 2.0);
                        doorObject.position.set(i - description.tamanho.comprimento / 2.0, 0.5, j - description.tamanho.largura / 2.0 + 0.5);
                        this.object.add(doorObject);
                    }
                    
                    //adição de elevadpr virado a norte
                    if (description.map[j][i] == 9 || description.map[j][i] == 11) {
                     //  elevatorObject = this.elevator.object.clone();
                      //  elevatorObject.cellToCartesian(i - description.tamanho.comprimento / 2.0 + 0.5, j - description.tamanho.largura / 2.0);
                      //  this.object.add(elevatorObject);
                      // Adicione a instância do elevador ao array
                    }
                    //adição de elevador virado a oeste
                    if (description.map[j][i] == 8 || description.map[j][i] == 10) {
                      
                       // elevatorObject = this.elevator.object.clone();
                       // elevatorObject.rotateY(Math.PI / 2.0);
                       // elevatorObject.position.set(i - description.tamanho.comprimento / 2.0, 0.5, j - description.tamanho.largura / 2.0 + 0.5);
                       // this.object.add(elevatorObject);
                    }
                }
            }

            this.object.scale.set(this.scale.x, this.scale.y, this.scale.z);
            this.loaded = true;
        }

        this.onProgress = function (url, xhr) {
            console.log("Resource '" + url + "' " + (100.0 * xhr.loaded / xhr.total).toFixed(0) + "% loaded.");
        }

        this.onError = function (url, error) {
            console.error("Error loading resource " + url + " (" + error + ").");
        }

        for (const [key, value] of Object.entries(parameters)) {
            this[key] = value;
        }
        this.loaded = false;

        // The cache must be enabled; additional information available at https://threejs.org/docs/api/en/loaders/FileLoader.html
        THREE.Cache.enabled = true;

        // Create a resource file loader
        const loader = new THREE.FileLoader();

        // Set the response type: the resource file will be parsed with JSON.parse()
        loader.setResponseType("json");

        // Load a maze description resource file
        loader.load(
            //Resource URL
            this.url,

            // onLoad callback
            description => this.onLoad(description),

            // onProgress callback
            xhr => this.onProgress(this.url, xhr),

            // onError callback
            error => this.onError(this.url, error)
        );
    }

    // Convert cell [row, column] coordinates to cartesian (x, y, z) coordinates
    cellToCartesian(position) {
        return new THREE.Vector3((position[1] - this.tamanho.comprimento / 2.0 + 0.5) * this.scale.x, 0.0, (position[0] - this.tamanho.largura / 2.0 + 0.5) * this.scale.z)
    }

    // Convert cartesian (x, y, z) coordinates to cell [row, column] coordinates
    cartesianToCell(position) {
        return [Math.floor(position.z / this.scale.z + this.tamanho.largura / 2.0), Math.floor(position.x / this.scale.x + this.tamanho.comprimento / 2.0)];
    }

    distanceToWestWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return position.x - this.cellToCartesian(indices).x + this.scale.x / 2.0;
        }
        return Infinity;
    }

    distanceToEastWall(position) {
        const indices = this.cartesianToCell(position);
        indices[1]++;
        if (this.map[indices[0]][indices[1]] == 1 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).x - this.scale.x / 2.0 - position.x;
        }
        return Infinity;
    }

    distanceToNorthWall(position) {
        const indices = this.cartesianToCell(position);
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return position.z - this.cellToCartesian(indices).z + this.scale.z / 2.0;
        }
        return Infinity;
    }

    distanceToSouthWall(position) {
        const indices = this.cartesianToCell(position);
        indices[0]++;
        if (this.map[indices[0]][indices[1]] == 2 || this.map[indices[0]][indices[1]] == 3) {
            return this.cellToCartesian(indices).z - this.scale.z / 2.0 - position.z;
        }
        return Infinity;
    }

    foundExit(position) {
        return Math.abs(position.x - this.exitLocation.x) < 0.5 * this.scale.x && Math.abs(position.z - this.exitLocation.z) < 0.5 * this.scale.z
    };
}